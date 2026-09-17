const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const verifyEventCoordinatorAccess = require("../../middleware/eventCoordinatorAccess");
const attendanceController = require("../../controllers/postgres/attendanceController");

const router = express.Router();

router.get(
  "/event/:eventId",
  verifyJwt,
  allowRoles("coordinator", "admin", "registration_desk"),
  verifyEventCoordinatorAccess,
  attendanceController.getEventAttendance
);

router.get(
  "/day/:day",
  verifyJwt,
  allowRoles("coordinator", "admin", "registration_desk"),
  attendanceController.getDayAttendance
);

router.get(
  "/day/:day/roster",
  verifyJwt,
  allowRoles("admin", "registration_desk"),
  attendanceController.getDayRoster
);

router.post(
  "/day/:day/manual",
  verifyJwt,
  allowRoles("admin", "registration_desk"),
  attendanceController.markDayAttendance
);

router.post(
  "/",
  verifyJwt,
  allowRoles("coordinator", "admin", "registration_desk"),
  verifyEventCoordinatorAccess,
  attendanceController.markAttendance
);

router.post(
  "/scan-qr",
  verifyJwt,
  attendanceController.markSelfAttendanceByQR
);

module.exports = router;
