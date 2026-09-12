const express = require("express");
const { verifyJwt } = require("../../middleware/auth");
const allowRoles = require("../../middleware/allowRoles");
const registrationAttendanceSummaryController = require("../../controllers/postgres/registrationAttendanceSummaryController");

const router = express.Router();

router.get(
  "/",
  verifyJwt,
  allowRoles("admin", "registration_desk"),
  registrationAttendanceSummaryController.getSummaryForAdminDesk
);

module.exports = router;
