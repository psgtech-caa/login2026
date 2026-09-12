const { RegistrationAttendanceSummary, Registration, Attendance, User } = require("../models/postgres");

const refreshRegistrationAttendanceSummary = async () => {
  try {
    const students = await User.findAll({ where: { role: "participant" }, attributes: ["id"] });

    for (const student of students) {
      const registrations = await Registration.findAll({
        where: { student_id: student.id, status: "registered" },
        attributes: ["event_id"],
      });

      const registeredEventIds = registrations.map((reg) => reg.event_id);
      const totalRegisteredEvents = registeredEventIds.length;

      let totalPresentEvents = 0;
      if (totalRegisteredEvents > 0) {
        const attendanceRows = await Attendance.findAll({
          where: {
            student_id: student.id,
            event_id: registeredEventIds,
            status: "present",
          },
          attributes: ["event_id"],
        });
        totalPresentEvents = attendanceRows.length;
      }

      const overallAttendancePercentage = totalRegisteredEvents > 0
        ? Number(((totalPresentEvents / totalRegisteredEvents) * 100).toFixed(2))
        : 0;

      let overallStatus = "not_marked";
      if (totalRegisteredEvents === 0) {
        overallStatus = "not_marked";
      } else if (overallAttendancePercentage >= 75) {
        overallStatus = "excellent";
      } else if (overallAttendancePercentage >= 50) {
        overallStatus = "good";
      } else if (overallAttendancePercentage >= 25) {
        overallStatus = "fair";
      } else {
        overallStatus = "low";
      }

      await RegistrationAttendanceSummary.upsert({
        student_id: student.id,
        total_registered_events: totalRegisteredEvents,
        total_present_events: totalPresentEvents,
        overall_attendance_percentage: overallAttendancePercentage,
        overall_status: overallStatus,
        last_updated_at: new Date(),
      });
    }

    return { refreshed: true };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  refreshRegistrationAttendanceSummary,
};
