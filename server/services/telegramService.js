/**
 * Telegram Notification Service
 * Handles sending formatted notifications to a Telegram group for key site events.
 */

// In-memory cache to prevent duplicate notifications (TTL 5 minutes)
const processedEventsCache = new Map();
const DEDUP_TTL_MS = 5 * 60 * 1000;

/**
 * Format Date & Time cleanly into readable IST string.
 * Example: 09 Sep 2026, 01:50 PM IST
 */
const formatDateTime = (dateVal) => {
  try {
    const d = dateVal ? new Date(dateVal) : new Date();
    if (isNaN(d.getTime())) {
      return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    }
    const formatted = d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${formatted} IST`;
  } catch (error) {
    return new Date().toISOString();
  }
};

/**
 * Clean up expired keys from deduplication cache to prevent memory leaks.
 */
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, timestamp] of processedEventsCache.entries()) {
    if (now - timestamp > DEDUP_TTL_MS) {
      processedEventsCache.delete(key);
    }
  }
};

/**
 * Check if event key was recently sent. If not, record it.
 */
const isDuplicateEvent = (eventKey) => {
  if (!eventKey) return false;
  cleanupCache();
  const now = Date.now();
  if (processedEventsCache.has(eventKey)) {
    return true;
  }
  processedEventsCache.set(eventKey, now);
  return false;
};

/**
 * Sanitize error message to guarantee bot token is never printed in logs.
 */
const sanitizeErrorMessage = (message, botToken) => {
  if (!message || typeof message !== 'string') return 'Unknown error';
  if (botToken) {
    return message.split(botToken).join('[REDACTED_BOT_TOKEN]');
  }
  return message;
};

/**
 * Send plain text message to configured Telegram Group.
 * Fail-safe: Errors are caught and logged cleanly without throwing.
 */
const sendMessage = async (text) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const groupId = process.env.TELEGRAM_GROUP_ID;

  if (!botToken || !groupId) {
    // Missing credentials - skip sending silently or print helpful non-blocking message once
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: groupId,
        text: text,
      }),
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.description || `HTTP ${response.status} ${response.statusText}`;
      console.error(`[TelegramService] Telegram API error: ${sanitizeErrorMessage(errorMsg, botToken)}`);
      return false;
    }

    return true;
  } catch (error) {
    const safeError = sanitizeErrorMessage(error.message, botToken);
    console.error(`[TelegramService] Failed to send Telegram message: ${safeError}`);
    return false;
  }
};

/**
 * Event 1: USER REGISTERED
 */
const notifyUserRegistered = async ({ name, email, phone, userId, registeredAt }) => {
  const dedupKey = `user_registered:${userId || email}`;
  if (isDuplicateEvent(dedupKey)) {
    return false;
  }

  const formattedDate = formatDateTime(registeredAt);
  const message = [
    '🟢 NEW USER REGISTERED 🎉',
    '',
    `👤 Name: ${name || 'N/A'}`,
    `📧 Email: ${email || 'N/A'}`,
    `📱 Phone: ${phone || 'N/A'}`,
    `🆔 User ID: ${userId || 'N/A'}`,
    `🕐 Registered: ${formattedDate}`,
  ].join('\n');

  return sendMessage(message);
};

/**
 * Event 2: PAYMENT REQUESTED
 */
const notifyPaymentRequested = async ({ name, userId, email, amount, paymentRequestId, requestedAt }) => {
  const dedupKey = `payment_requested:${paymentRequestId || userId}`;
  if (isDuplicateEvent(dedupKey)) {
    return false;
  }

  const formattedDate = formatDateTime(requestedAt);
  const numAmount = Number(amount);
  const displayAmount = isNaN(numAmount) ? amount : (numAmount % 1 === 0 ? numAmount : numAmount.toFixed(2));

  const message = [
    '🟡 PAYMENT REQUEST 💰',
    '',
    `👤 Name: ${name || 'N/A'}`,
    `🆔 User ID: ${userId || 'N/A'}`,
    `📧 Email: ${email || 'N/A'}`,
    `💵 Amount: ₹${displayAmount}`,
    `🧾 Payment Request ID: ${paymentRequestId || 'N/A'}`,
    `📌 Status: Payment Requested`,
    `🕐 Requested At: ${formattedDate}`,
  ].join('\n');

  return sendMessage(message);
};

/**
 * Event 3: PAYMENT CONFIRMED
 */
const notifyPaymentConfirmed = async ({ name, userId, email, amount, paymentId, confirmedAt }) => {
  const dedupKey = `payment_confirmed:${paymentId || userId}`;
  if (isDuplicateEvent(dedupKey)) {
    return false;
  }

  const formattedDate = formatDateTime(confirmedAt);
  const numAmount = Number(amount);
  const displayAmount = isNaN(numAmount) ? amount : (numAmount % 1 === 0 ? numAmount : numAmount.toFixed(2));

  const message = [
    '🔵 PAYMENT CONFIRMED ✅',
    '',
    `👤 Name: ${name || 'N/A'}`,
    `🆔 User ID: ${userId || 'N/A'}`,
    `📧 Email: ${email || 'N/A'}`,
    `💵 Amount: ₹${displayAmount}`,
    `🧾 Payment ID: ${paymentId || 'N/A'}`,
    `📌 Status: Confirmed`,
    `🕐 Confirmed At: ${formattedDate}`,
  ].join('\n');

  return sendMessage(message);
};

/**
 * Event 4: LOGIN ATTEMPT (Valid & Invalid attempts with timestamp)
 */
const notifyLoginAttempt = async ({ identifier, success, user, reason, loginType = 'password', time }) => {
  const formattedDate = formatDateTime(time || new Date());

  let message = '';
  if (success) {
    message = [
      '🔑 LOGIN SUCCESSFUL 🟢',
      '',
      `👤 Name: ${user?.name || 'N/A'}`,
      `🆔 User ID: ${user?.student_id_code || user?.login_id || user?.id || 'N/A'}`,
      `📧 Email: ${user?.email || 'N/A'}`,
      `📱 Identifier Used: ${identifier || user?.email || 'N/A'}`,
      `🔐 Method: ${loginType.toUpperCase()}`,
      `🕐 Login Time: ${formattedDate}`,
    ].join('\n');
  } else {
    message = [
      '⚠️ LOGIN ATTEMPT FAILED 🔴',
      '',
      `📱 Identifier Attempted: ${identifier || 'N/A'}`,
      `🔐 Method: ${loginType.toUpperCase()}`,
      `📌 Reason: ${reason || 'Invalid Credentials'}`,
      `🕐 Attempt Time: ${formattedDate}`,
    ].join('\n');
  }

  return sendMessage(message);
};

/**
 * Event 5: OTP GENERATED
 */
const notifyOtpGenerated = async ({ email, otp, time }) => {
  const formattedDate = formatDateTime(time || new Date());
  const message = [
    '🔑 OTP GENERATED 📨',
    '',
    `📧 Email: ${email || 'N/A'}`,
    `🔢 Verification OTP Code: ${otp || 'N/A'}`,
    `🕐 Generated At: ${formattedDate}`,
  ].join('\n');

  return sendMessage(message);
};

module.exports = {
  sendMessage,
  notifyUserRegistered,
  notifyPaymentRequested,
  notifyPaymentConfirmed,
  notifyLoginAttempt,
  notifyOtpGenerated,
};
