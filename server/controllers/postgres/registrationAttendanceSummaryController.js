const { RegistrationAttendanceSummary, User } = require("../../models/postgres");

const getSummaryForAdminDesk = async (req, res) => {
  try {
    const records = await RegistrationAttendanceSummary.findAll({
      include: [{
        model: User,
        as: "student",
        attributes: ["id", "name", "email", "login_id", "college_name", "department", "role"],
      }],
      order: [["overall_attendance_percentage", "DESC"], ["total_present_events", "DESC"], ["student_id", "ASC"]],
    });

    return res.json(records.map((item) => ({
      id: item.id,
      student_id: item.student_id,
      total_registered_events: item.total_registered_events,
      total_present_events: item.total_present_events,
      overall_attendance_percentage: Number(item.overall_attendance_percentage || 0),
      overall_status: item.overall_status,
      last_updated_at: item.last_updated_at,
      student: item.student ? {
        id: item.student.id,
        name: item.student.name,
        email: item.student.email,
        login_id: item.student.login_id,
        college_name: item.student.college_name,
        department: item.student.department,
        role: item.student.role,
      } : null,
    })));
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch registration attendance summary", error: error.message });
  }
};

module.exports = {
  getSummaryForAdminDesk,
};
