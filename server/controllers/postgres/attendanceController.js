const attendanceModel = require("../../models/postgres/attendanceModel");
const eventModel = require("../../models/postgres/eventModel");
const registrationModel = require("../../models/postgres/registrationModel");
const userModel = require("../../models/postgres/userModel");
const paymentModel = require("../../models/postgres/paymentModel");
const { Op } = require("sequelize");
const { refreshRegistrationAttendanceSummary } = require("../../services/registrationAttendanceSummaryService");
const paidStatuses = ["VERIFIED", "PENDING", "successful", "in_progress", "review"];

const refreshSummarySafely = async () => {
  try {
    await refreshRegistrationAttendanceSummary();
  } catch (error) {
    console.warn("[Attendance] Summary refresh skipped:", error.message);
  }
};

const normalizeAttendanceStatus = (status) => {
  if (typeof status !== "string") return null;
  const normalized = status.trim().toLowerCase();
  return ["present", "absent", "not_marked"].includes(normalized) ? normalized : null;
};

const getEventAttendance = async (req, res) => {
  try {
    const attendance = await attendanceModel.findAll({
      where: { event_id: req.params.eventId, status: "present" },
      include: [
        { model: require("../../models/postgres/userModel"), as: "student", attributes: ["id", "name", "login_id", "college_name", "department"] },
        { model: eventModel, as: "event", attributes: ["id", "name", "day"] },
      ],
      order: [["student_id", "ASC"]],
    });

    const uniqueParticipants = new Map();
    attendance.forEach((entry) => {
      const key = String(entry.student_id);
      const current = uniqueParticipants.get(key);
      if (!current || new Date(entry.marked_at || 0) > new Date(current.marked_at || 0)) {
        uniqueParticipants.set(key, entry);
      }
    });

    return res.json([...uniqueParticipants.values()]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch attendance", error: error.message });
  }
};

const getDayAttendance = async (req, res) => {
  try {
    const day = Number(req.params.day);
    if (!Number.isInteger(day)) return res.status(400).json({ message: "Invalid event day" });

    const attendance = await attendanceModel.findAll({
      include: [
        { model: require("../../models/postgres/userModel"), as: "student", attributes: ["id", "name", "login_id", "college_name", "department"] },
        { model: eventModel, as: "event", where: { day }, attributes: ["id", "name", "day"] },
      ],
      where: { status: "present" },
      order: [["marked_at", "DESC"]],
    });

    return res.json(attendance);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch day attendance", error: error.message });
  }
};

const getDayRoster = async (req, res) => {
  try {
    const day = Number(req.params.day);
    const registrations = await registrationModel.findAll({
      where: { status: "registered" },
      include: [
        { model: eventModel, as: "event", where: { day }, required: true, attributes: ["id", "name", "day"] },
        { model: userModel, as: "student", attributes: ["id", "name", "login_id", "college_name"] },
      ],
    });
    const studentIds = [...new Set(registrations.map((row) => row.student_id))];
    const payments = studentIds.length ? await paymentModel.findAll({ where: { student_id: { [Op.in]: studentIds } } }) : [];
    const paid = new Set(payments.filter((payment) => paidStatuses.includes(String(payment.status))).map((payment) => payment.student_id));
    const attendances = await attendanceModel.findAll({ where: { student_id: studentIds, status: "present" }, include: [{ model: eventModel, as: "event", where: { day }, required: true }] });
    const attendanceByStudent = new Map();
    attendances.forEach((row) => {
      const current = attendanceByStudent.get(row.student_id);
      if (!current || new Date(row.marked_at || 0) > new Date(current.marked_at || 0)) attendanceByStudent.set(row.student_id, row);
    });
    const roster = new Map();
    registrations.forEach((registration) => {
      if (!paid.has(registration.student_id) || roster.has(registration.student_id)) return;
      const attendance = attendanceByStudent.get(registration.student_id);
      roster.set(registration.student_id, { student: registration.student, student_id: registration.student_id, status: attendance ? "PRESENT" : "ABSENT", marked_at: attendance?.marked_at || null });
    });
    return res.json([...roster.values()]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch day roster", error: error.message });
  }
};

const markDayAttendance = async (req, res) => {
  try {
    const day = Number(req.params.day);
    const { student_id, status = "present" } = req.body;
    const normalizedStatus = normalizeAttendanceStatus(status);
    if (!Number.isInteger(day) || !student_id || !normalizedStatus) return res.status(400).json({ message: "Valid day, participant and attendance status are required" });

    if (normalizedStatus === "absent") {
      const dayEvents = await eventModel.findAll({ where: { day }, attributes: ["id"] });
      const eventIds = dayEvents.map((event) => event.id);
      if (eventIds.length) {
        await attendanceModel.update(
          { status: "absent", marked_by: req.user.id, marked_at: new Date() },
          { where: { student_id, event_id: { [Op.in]: eventIds } } }
        );
      }
      await refreshSummarySafely();
      return res.json({ message: `Day ${day} attendance revoked`, student_id, status: "ABSENT" });
    }

    const registrations = await registrationModel.findAll({ where: { student_id, status: "registered" }, include: [{ model: eventModel, as: "event", where: { day }, required: true }] });
    if (!registrations.length) return res.status(404).json({ message: "Participant has no registered event for this day" });
    const payment = await paymentModel.findOne({ where: { student_id, status: { [Op.in]: paidStatuses } } });
    if (!payment) return res.status(403).json({ message: "Only paid participants can receive attendance" });
    const eventIds = registrations.map((registration) => registration.event_id);
    const attendanceValues = { status: normalizedStatus, marked_by: req.user.id, marked_at: new Date() };

    for (const eventId of eventIds) {
      await attendanceModel.upsert({ event_id: eventId, student_id, ...attendanceValues });
    }
    await refreshSummarySafely();
    return res.json({ message: `Day ${day} attendance updated`, student_id, status: normalizedStatus.toUpperCase() });
  } catch (error) {
    console.error("[Attendance] Day manual update failed:", error);
    return res.status(500).json({ message: "Failed to update day attendance", error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { event_id, student_id, status } = req.body;
    const normalizedStatus = normalizeAttendanceStatus(status);

    if (!normalizedStatus) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    const [attendance] = await attendanceModel.findOrCreate({
      where: { event_id, student_id },
      defaults: {
        event_id,
        student_id,
        status: normalizedStatus,
        marked_by: req.user.id,
        marked_at: new Date(),
      },
    });

    if (attendance.status !== normalizedStatus || attendance.marked_by !== req.user.id) {
      await attendance.update({
        status: normalizedStatus,
        marked_by: req.user.id,
        marked_at: new Date(),
      });
    }

    await refreshSummarySafely();

    return res.json({ message: "Attendance updated", attendance });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update attendance", error: error.message });
  }
};

const markSelfAttendanceByQR = async (req, res) => {
  try {
    const { qr_code } = req.body;
    if (!qr_code) {
      return res.status(400).json({ message: "QR code payload is required" });
    }

    // Parse event or day QR codes without requiring a schema change.
    let eventId = null;
    let dayNumber = null;
    const cleanStr = String(qr_code).trim();
    if (cleanStr.includes("LOGIN2K26-ATTENDANCE-EVT-")) {
      eventId = parseInt(cleanStr.replace("LOGIN2K26-ATTENDANCE-EVT-", "").trim(), 10);
    } else if (cleanStr.includes("LOGIN2K26-ATTENDANCE-DAY-")) {
      dayNumber = parseInt(cleanStr.replace("LOGIN2K26-ATTENDANCE-DAY-", "").trim(), 10);
    } else if (!isNaN(parseInt(cleanStr, 10))) {
      eventId = parseInt(cleanStr, 10);
    }

    if ((!eventId || isNaN(eventId)) && (!dayNumber || isNaN(dayNumber))) {
      return res.status(400).json({ message: "Invalid QR Code payload" });
    }

    const studentId = req.user.id;

    if (dayNumber) {
      const registrations = await registrationModel.findAll({
        where: { student_id: studentId, status: "registered" },
        include: [{ model: eventModel, as: "event", where: { day: dayNumber }, required: true }],
      });

      if (!registrations.length) {
        return res.status(400).json({ message: `You have no registered events for Day ${dayNumber}.` });
      }

      for (const registration of registrations) {
        const [attendance] = await attendanceModel.findOrCreate({
          where: { event_id: registration.event_id, student_id: studentId },
          defaults: {
            event_id: registration.event_id,
            student_id: studentId,
            status: "present",
            marked_by: studentId,
            marked_at: new Date(),
          },
        });
        if (attendance.status !== "present") {
          await attendance.update({ status: "present", marked_by: studentId, marked_at: new Date() });
        }
      }

      await refreshSummarySafely();

      return res.json({
        message: `Day ${dayNumber} attendance marked for ${registrations.length} registered event${registrations.length === 1 ? "" : "s"}.`,
        day: dayNumber,
        event_count: registrations.length,
        attendance_marked: true,
      });
    }

    // Fetch event details
    const event = await eventModel.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found for this QR code" });
    }

    const registration = await registrationModel.findOne({
      where: { event_id: eventId, student_id: studentId, status: "registered" },
    });
    if (!registration) {
      return res.status(403).json({ message: "You must be registered for this event before attendance can be marked." });
    }

    // Find or create attendance
    const [attendance] = await attendanceModel.findOrCreate({
      where: { event_id: eventId, student_id: studentId },
      defaults: {
        event_id: eventId,
        student_id: studentId,
        status: "present",
        marked_by: studentId,
        marked_at: new Date(),
      },
    });

    if (attendance.status !== "present") {
      await attendance.update({
        status: "present",
        marked_by: studentId,
        marked_at: new Date(),
      });
    }

    await refreshSummarySafely();

    return res.json({
      message: `Attendance marked as PRESENT for ${event.name}!`,
      event_name: event.name,
      attendance,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to mark attendance", error: error.message });
  }
};

module.exports = {
  getEventAttendance,
  getDayAttendance,
  getDayRoster,
  markDayAttendance,
  markAttendance,
  markSelfAttendanceByQR,
};
