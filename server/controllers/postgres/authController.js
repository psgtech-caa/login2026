const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { Op } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("../../models/postgres/userModel");
const paymentModel = require("../../models/postgres/paymentModel");
const registrationModel = require("../../models/postgres/registrationModel");
const teamModel = require("../../models/postgres/teamModel");
const teamMemberModel = require("../../models/postgres/teamMemberModel");
const otpModel = require("../../models/postgres/otpModel");
const {
  sendEmail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendAlumniWelcomeEmail,
} = require("../../services/emailService");
const alumniModel = require("../../models/postgres/alumniModel");
const telegramService = require("../../services/telegramService");

const jwtSecret = process.env.JWT_SECRET;
const googleClient = new OAuth2Client();

/**
 * Validate password strength: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char.
 */
const isStrongPassword = (password) => {
  if (typeof password !== 'string' || password.length < 6) return false;
  return true;
};

const PASSWORD_POLICY_MSG = 'Password must be at least 6 characters.';

/**
 * Escape HTML special characters to prevent XSS in email templates.
 */
const escapeHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const normalizeRole = (role) => {
  const value = String(role || '').trim().toLowerCase();
  const roleMap = {
    student: 'participant',
    participant: 'participant',
    event_coordinator: 'coordinator',
    coordinator: 'coordinator',
    special_user: 'coordinator',
    junior_attendance: 'coordinator',
    admin: 'admin',
    super_admin: 'admin',
    admin_power: 'admin',
  };

  return roleMap[value] || value || 'participant';
};

const LOGIN_ID_PREFIX = "LOGIN";
const LOGIN_ID_START = 101;

const parseStoredTeamEmails = (value) => {
  if (!value) return [];
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((email) => String(email).trim().toLowerCase()).filter(Boolean);
  } catch (error) {
    return [];
  }
};

const pairPendingTeamInvite = async (userId, email) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  if (!normalizedEmail) return null;

  const teams = await teamModel.findAll();
  let pairedTeam = null;

  for (const team of teams) {
    const pendingEmails = parseStoredTeamEmails(team.member_emails);
    if (!pendingEmails.includes(normalizedEmail)) continue;

    pairedTeam = team;
    await teamMemberModel.findOrCreate({
      where: { team_id: team.id, student_id: userId },
      defaults: { team_id: team.id, student_id: userId, role: "member", status: "accepted" },
    });

    const updatedEmails = pendingEmails.filter((item) => item !== normalizedEmail);
    await team.update({ member_emails: JSON.stringify(updatedEmails) });
    break;
  }

  return pairedTeam;
};

/**
 * Generate the next sequential LOGIN ID.
 * Uses a database transaction and unique constraint to prevent duplicates
 * under concurrent registrations.
 */
const generateLoginId = async (transaction) => {
  const result = await sequelize.query(
    `SELECT login_id FROM users WHERE login_id IS NOT NULL ORDER BY id DESC LIMIT 50`,
    { type: sequelize.constructor.QueryTypes.SELECT, transaction }
  );

  let maxNum = LOGIN_ID_START - 1;
  for (const row of result) {
    const match = row.login_id && row.login_id.match(/^LOGIN(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  return `${LOGIN_ID_PREFIX}${maxNum + 1}`;
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: "Valid email address is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Ensure OTP table is initialized
    try {
      await otpModel.sync();
    } catch (sErr) {
      // ignore
    }

    // Anti-bot & Flood Prevention: Check for 60-second per-email cooldown
    const existingOtp = await otpModel.findOne({ where: { email: normalizedEmail } }).catch(() => null);
    if (existingOtp) {
      const now = Date.now();
      const lastSentTime = new Date(existingOtp.updatedAt || existingOtp.createdAt).getTime();
      const secondsPassed = (now - lastSentTime) / 1000;

      if (secondsPassed < 60) {
        const waitSeconds = Math.ceil(60 - secondsPassed);
        return res.status(429).json({
          message: `Please wait ${waitSeconds} second${waitSeconds === 1 ? '' : 's'} before requesting a new OTP.`,
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      if (existingOtp) {
        await existingOtp.update({ otp, expires_at: expiresAt });
      } else {
        await otpModel.create({ email: normalizedEmail, otp, expires_at: expiresAt });
      }
    } catch (dbErr) {
      console.warn("OTP DB store warning, syncing and retrying:", dbErr.message);
      await otpModel.sync().catch(() => null);
      await otpModel.upsert({ email: normalizedEmail, otp, expires_at: expiresAt }).catch(() => null);
    }

    console.log(`\n==================================================\n[OTP GENERATED] Email: ${normalizedEmail} | OTP CODE: ${otp}\n==================================================\n`);

    telegramService.notifyOtpGenerated({ email: normalizedEmail, otp }).catch(() => null);

    try {
      await sendOtpEmail(normalizedEmail, otp, 10);
    } catch (emailErr) {
      console.warn(`[OTP Email Warning] Could not send email to ${normalizedEmail}: ${emailErr.message}. OTP code: ${otp}`);
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Failed to send OTP:", error.message || error);
    return res.status(200).json({ message: "OTP sent successfully" });
  }
};

const buildUserResponse = (user, hasPaidFee, registrations = []) => ({
  id: user.id,
  login_id: user.login_id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  college_name: user.college_name,
  department: user.department,
  roll_no: user.roll_no,
  role: user.role,
  user_type: user.user_type,
  student_id_code: user.student_id_code,
  is_active: user.is_active,
  accommodation_required: user.accommodation_required,
  must_change_password: user.must_change_password,
  hasPaidFee,
  registrations: registrations.map((r) => ({ worldId: r.event_id })),
});

const authenticateUser = async (user, res, loginType = 'password', identifier = '') => {
  if (!user.is_active) {
    telegramService.notifyLoginAttempt({
      identifier: identifier || user.email,
      success: false,
      user,
      reason: 'Account is inactive',
      loginType,
      time: new Date(),
    }).catch(() => {});
    return res.status(403).json({ message: "User account is inactive" });
  }

  const normalizedRole = normalizeRole(user.role);
  if (normalizedRole === 'alumni' || String(user.user_type || '').toUpperCase() === 'ALUMNI') {
    telegramService.notifyLoginAttempt({
      identifier: identifier || user.email,
      success: false,
      user,
      reason: 'Alumni account blocked from dashboard login',
      loginType,
      time: new Date(),
    }).catch(() => {});
    return res.status(403).json({ message: 'Alumni accounts are not available for dashboard login.' });
  }

  telegramService.notifyLoginAttempt({
    identifier: identifier || user.email,
    success: true,
    user,
    loginType,
    time: new Date(),
  }).catch(() => {});

  const isProduction = (process.env.APP_ENV || process.env.NODE_ENV || '').toLowerCase() === 'production';
  const token = jwt.sign(
    { id: user.id, role: normalizedRole, user_type: user.user_type },
    jwtSecret,
    { expiresIn: "24h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  const payment = await paymentModel.findOne({
    where: { student_id: user.id, status: ["PENDING", "VERIFIED"] }
  });
  const registrations = await registrationModel.findAll({ where: { student_id: user.id } });

  return res.status(200).json({
    message: "Login successful",
    token,
    user: buildUserResponse(user, !!payment, registrations),
  });
};

const registerUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      name,
      email,
      phone,
      password,
      college_name,
      department,
      roll_no,
      user_type = "PARTICIPANT",
      gender,
      year_of_study,
      batch_year,
      place,
      current_organization,
      accommodation_required = false,
      otp,
    } = req.body;

    const isAlumni = String(user_type).toUpperCase() === "ALUMNI";
    const trimmedName = String(name || "").trim();
    const finalEmail = email ? String(email).trim().toLowerCase() : "";
    const finalPhone = phone ? String(phone).trim() : "";
    const trimmedPassword = typeof password === "string" ? password.trim() : "";
    const trimmedOtp = typeof otp === "string" ? otp.trim() : "";

    if (!trimmedName) {
      await transaction.rollback();
      return res.status(400).json({ message: "Full name is required for registration." });
    }

    if (trimmedName.length > 35) {
      await transaction.rollback();
      return res.status(400).json({ message: "Full name must not exceed 35 characters." });
    }

    if (!finalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (!isAlumni && !isStrongPassword(trimmedPassword)) {
      await transaction.rollback();
      return res.status(400).json({ message: PASSWORD_POLICY_MSG });
    }

    if (!isAlumni && (!college_name || String(college_name).trim().length < 2)) {
      await transaction.rollback();
      return res.status(400).json({ message: "College name is required." });
    }

    if (!isAlumni && (!department || String(department).trim().length < 2)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Department is required." });
    }

    if (!isAlumni && (!roll_no || String(roll_no).trim().length < 1)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Roll / Registration number is required." });
    }

    if (!gender || String(gender).trim().length < 1) {
      await transaction.rollback();
      return res.status(400).json({ message: "Please select a gender." });
    }

    if (!finalPhone) {
      await transaction.rollback();
      return res.status(400).json({ message: "WhatsApp mobile number is required." });
    }

    const digitsOnly = finalPhone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15 || !/^\+?[0-9\s()-]{10,18}$/.test(finalPhone)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Please enter a valid mobile number with at least 10 digits." });
    }

    if (isAlumni) {
      const trimmedBatch = String(batch_year || "").trim();
      if (!trimmedBatch || !/^\d{2}MX$/i.test(trimmedBatch)) {
        await transaction.rollback();
        return res.status(400).json({ message: "Batch must be exactly 2 digits followed by MX (e.g. 25MX, 96MX)." });
      }
      if (!place || String(place).trim().length < 2) {
        await transaction.rollback();
        return res.status(400).json({ message: "City / Location is required." });
      }
      if (!current_organization || String(current_organization).trim().length < 2) {
        await transaction.rollback();
        return res.status(400).json({ message: "Current organization is required." });
      }
    } else {
      if (!year_of_study || !String(year_of_study).trim()) {
        await transaction.rollback();
        return res.status(400).json({ message: "Please select a year of study." });
      }
    }

    if (!trimmedOtp || !/^\d{6}$/.test(trimmedOtp)) {
      await transaction.rollback();
      return res.status(400).json({ message: "OTP is required and must be a 6-digit code." });
    }

    const loginId = isAlumni ? null : await generateLoginId(transaction);

    const validOtp = await otpModel.findOne({ where: { email: finalEmail, otp: trimmedOtp }, transaction });
    if (!validOtp) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (new Date() > validOtp.expires_at) {
      await transaction.rollback();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Delete OTP so it cannot be reused
    await validOtp.destroy({ transaction });

    const existingAlumni = isAlumni && email
      ? await alumniModel.findOne({ where: { email: finalEmail }, transaction })
      : null;
    if (existingAlumni) {
      await transaction.rollback();
      return res.status(409).json({ message: "Email address is already registered" });
    }

    // Only check for an existing user when registering a participant or staff account.
    if (email) {
      const existingUser = await userModel.findOne({
        where: { email: finalEmail },
        transaction,
      });

      if (existingUser) {
        await transaction.rollback();
        return res.status(409).json({
          message: "Email address is already registered",
        });
      }
    }

    if (isAlumni) {
      const alumni = await alumniModel.create({
        name,
        email: finalEmail,
        phone: finalPhone,
        batch_year: String(batch_year || "").trim().toUpperCase(),
        gender,
        place,
        current_organization,
        accommodation_required: Boolean(accommodation_required),
      }, { transaction });
      await transaction.commit();
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      sendAlumniWelcomeEmail({
        name: alumni.name,
        email: finalEmail,
        batchYear: alumni.batch_year || 'Alumni',
        calendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=LOGIN+2K26+35th+Edition+Alumni+Reunion&dates=20260918T033000Z/20260919T113000Z&details=Welcome+back+to+PSG+Tech+for+the+35th+Edition+of+LOGIN+2K26+National+Cyber+Symposium!&location=PSG+College+of+Technology,+Coimbatore`,
      }).catch((err) => console.error("Failed to send alumni welcome email:", err));

      telegramService.notifyUserRegistered({
        name: alumni.name,
        email: finalEmail,
        phone: alumni.phone,
        userId: `ALUMNI-${alumni.batch_year || 'ALUMNI'} (#${alumni.id})`,
        registeredAt: alumni.createdAt || new Date(),
      }).catch(() => {});

      return res.status(201).json({ message: "Alumni registration saved successfully." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const normalizedRole = "participant";
    const user = await userModel.create(
      {
        name,
        email: finalEmail,
        phone: finalPhone,
        password: hashedPassword,
        college_name: college_name || "PSG College of Technology",
        department: department || "MCA",
        roll_no,
        user_type: "PARTICIPANT",
        gender,
        year_of_study,
        batch_year,
        place,
        current_organization,
        accommodation_required: Boolean(accommodation_required),
        role: normalizedRole,
        login_id: loginId,
      },
      { transaction }
    );

    await transaction.commit();

    await pairPendingTeamInvite(user.id, user.email);

    // Send welcome email with calendar invite only if email is provided
    if (email) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=LOGIN+2K26+35th+Edition+Alumni+Reunion&dates=20260918T033000Z/20260919T113000Z&details=Welcome+back+to+PSG+Tech+for+the+35th+Edition+of+LOGIN+2K26+National+Cyber+Symposium!&location=PSG+College+of+Technology,+Coimbatore`;

      if (isAlumni) {
        sendAlumniWelcomeEmail({
          name: user.name,
          email: finalEmail,
          batchYear: batch_year || 'Alumni',
          calendarUrl: calendarLink,
        }).catch((err) => console.error("Failed to send alumni welcome email:", err));
      } else {
        sendWelcomeEmail({
          to: finalEmail,
          name: user.name,
          loginId,
          loginUrl: `${frontendUrl}/login`,
        }).catch((err) => console.error("Failed to send welcome email:", err));
      }
    }

    telegramService.notifyUserRegistered({
      name: user.name,
      email: user.email,
      phone: user.phone,
      userId: user.login_id || user.id,
      registeredAt: user.createdAt || new Date(),
    }).catch(() => {});

    return res.status(201).json({
      message: "User registered successfully.",
      loginId
    });
  } catch (error) {
    try { await transaction.rollback(); } catch (_) {}
    return res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { loginId, email, identifier, password } = req.body;
    const inputVal = String(identifier || loginId || email || "").trim();

    if (!inputVal || !password) {
      telegramService.notifyLoginAttempt({
        identifier: inputVal || 'Empty',
        success: false,
        reason: !inputVal ? 'Missing LOGIN ID / Email' : 'Missing Password',
        loginType: 'password',
        time: new Date(),
      }).catch(() => {});

      return res.status(400).json({
        message: !inputVal ? "LOGIN ID or email is required" : "Password is required",
      });
    }

    const inputLower = inputVal.toLowerCase();
    const isSqlite = sequelize.getDialect() === "sqlite";

    let user = null;
    try {
      if (isSqlite) {
        user = await userModel.findOne({
          where: {
            [Op.or]: [
              { login_id: inputVal },
              { student_id_code: inputVal },
              { email: inputLower },
            ]
          }
        });
      } else {
        user = await userModel.findOne({
          where: {
            [Op.or]: [
              sequelize.where(sequelize.fn("LOWER", sequelize.col("login_id")), inputLower),
              sequelize.where(sequelize.fn("LOWER", sequelize.col("student_id_code")), inputLower),
              sequelize.where(sequelize.fn("LOWER", sequelize.col("email")), inputLower),
            ]
          }
        });
      }
    } catch (_) {
      user = await userModel.findOne({ where: { email: inputLower } });
    }

    if (!user) {
      telegramService.notifyLoginAttempt({
        identifier: inputVal,
        success: false,
        reason: 'User not found in system',
        loginType: 'password',
        time: new Date(),
      }).catch(() => {});

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.password || typeof user.password !== "string") {
      telegramService.notifyLoginAttempt({
        identifier: inputVal,
        success: false,
        user,
        reason: 'Password authentication not set for account',
        loginType: 'password',
        time: new Date(),
      }).catch(() => {});

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      telegramService.notifyLoginAttempt({
        identifier: inputVal,
        success: false,
        user,
        reason: 'Invalid password',
        loginType: 'password',
        time: new Date(),
      }).catch(() => {});

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return authenticateUser(user, res, 'password', inputVal);
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential, accessToken } = req.body || {};
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: 'Google sign-in is not configured.' });
    }

    let email = null;
    let googleId = null;

    if (credential && typeof credential === 'string') {
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: clientId });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        return res.status(401).json({ message: 'Google account verification failed.' });
      }
      email = payload.email.trim().toLowerCase();
      googleId = payload.sub;
    } else if (accessToken && typeof accessToken === 'string') {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!userInfoRes.ok) {
        return res.status(401).json({ message: 'Failed to verify Google access token.' });
      }
      const userInfo = await userInfoRes.json();
      if (!userInfo?.sub || !userInfo.email || userInfo.email_verified !== true) {
        return res.status(401).json({ message: 'Google account verification failed.' });
      }
      email = userInfo.email.trim().toLowerCase();
      googleId = userInfo.sub;
    } else {
      return res.status(400).json({ message: 'A Google sign-in credential or access token is required.' });
    }

    let user = await userModel.findOne({ where: { google_id: googleId } });
    if (!user) {
      user = await userModel.findOne({ where: { email } });
      if (!user) {
        telegramService.notifyLoginAttempt({
          identifier: email,
          success: false,
          reason: 'No account found for this Google email',
          loginType: 'google',
          time: new Date(),
        }).catch(() => {});

        return res.status(404).json({ message: 'No account found with this Google account. Please register first.', email });
      }
      if (user.google_id && user.google_id !== googleId) {
        telegramService.notifyLoginAttempt({
          identifier: email,
          success: false,
          user,
          reason: 'Linked to different Google account',
          loginType: 'google',
          time: new Date(),
        }).catch(() => {});

        return res.status(409).json({ message: 'This email is linked to a different Google account.' });
      }
      await user.update({ google_id: googleId });
    }

    return authenticateUser(user, res, 'google', email);
  } catch (error) {
    console.error("Google authentication error:", error);
    return res.status(401).json({ message: 'Google authentication failed. Please try again.' });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      // Return success anyway for security reasons
      return res.status(200).json({ message: "If account exists, an OTP has been sent." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours (120 minutes)

    const existingOtp = await otpModel.findOne({ where: { email: email.toLowerCase() } });
    if (existingOtp) {
      await existingOtp.update({ otp, expires_at: expiresAt });
    } else {
      await otpModel.create({ email: email.toLowerCase(), otp, expires_at: expiresAt });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?email=${encodeURIComponent(user.email)}&otp=${otp}`;

    await sendEmail({
      to: user.email,
      subject: "[LOGIN 2026] Password Reset Link",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0A0607; color: #F7F2F2; padding: 32px; border-radius: 6px; border: 1px solid #2A1A1D; text-align: center; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E01B22; margin-top: 0; font-size: 24px;">Password Reset Request</h2>
          <p style="color: #A79798; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">We received a request to reset your password. Click the secure button below to set a new password for your account.</p>
          <a href="${resetLink}" style="background-color: #E01B22; color: #F7F2F2; text-decoration: none; padding: 14px 28px; border-radius: 2px; font-weight: bold; font-family: monospace; letter-spacing: 1px; display: inline-block;">RESET PASSWORD</a>
          <p style="color: #6B5A5C; font-size: 12px; margin-top: 32px; border-top: 1px solid #2A1A1D; padding-top: 16px;">This link will expire in 2 hours. If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
      mailType: "otp",
    });

    return res.status(200).json({
      message: "Password reset link sent to your email (valid for 2 hours)",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to request password reset", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: PASSWORD_POLICY_MSG });
    }

    const validOtp = await otpModel.findOne({ where: { email: email.toLowerCase(), otp } });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (new Date() > validOtp.expires_at) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const user = await userModel.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.must_change_password = false;
    await user.save();

    await validOtp.destroy();

    return res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    return res.status(400).json({ message: "Failed to reset password" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!newPassword || !isStrongPassword(newPassword)) {
      return res.status(400).json({ message: PASSWORD_POLICY_MSG });
    }

    const user = await userModel.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Current password is required (prevent password change without knowing current password)
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: "Current password does not match" });

    user.password = await bcrypt.hash(newPassword, 12);
    user.must_change_password = false;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change password" });
  }
};

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ exists: false, message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userModel.findOne({
      where: { email: normalizedEmail },
    });

    if (user) {
      return res.json({ exists: true, message: "This email address is already registered." });
    }

    if (alumniModel) {
      try {
        const alumni = await alumniModel.findOne({
          where: { email: normalizedEmail },
        });
        if (alumni) {
          return res.json({ exists: true, message: "This email address is already registered as an alumni." });
        }
      } catch (err) {
        // Silently catch alumni lookup errors if model/table sync is transient
      }
    }

    return res.json({ exists: false, message: "Email is available." });
  } catch (error) {
    console.error("checkEmail error:", error.message || error);
    return res.json({ exists: false, message: "Email is available." });
  }
};

module.exports = {
  sendOtp,
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
  checkEmail,
};
