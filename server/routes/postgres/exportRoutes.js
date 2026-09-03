const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const exportController = require("../../controllers/postgres/exportController");

const router = express.Router();

router.get(
  "/event/:eventId/students",
  verifyJwt,
  allowRoles("coordinator", "admin", "registration_desk"),
  exportController.exportEventStudents
);

router.get(
  "/attendance",
  verifyJwt,
  allowRoles("coordinator", "admin", "registration_desk"),
  exportController.exportAttendance
);

router.get(
  "/users",
  verifyJwt,
  allowRoles("admin", "registration_desk"),
  exportController.exportUsers
);

router.get(
  "/registrations",
  verifyJwt,
  allowRoles("admin", "registration_desk"),
  exportController.exportRegistrations
);

router.get(
  "/payments",
  verifyJwt,
  allowRoles("admin", "registration_desk"),
  exportController.exportPayments
);

router.get(
  "/teams",
  verifyJwt,
  allowRoles("admin", "registration_desk"),
  exportController.exportTeams
);

router.get(
  "/alumni",
  verifyJwt,
  allowRoles("admin"),
  exportController.exportAlumni
);

module.exports = router;
