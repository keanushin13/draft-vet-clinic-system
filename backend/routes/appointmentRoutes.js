const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/appointmentController");

const appointmentRoles = authorizeRoles(
  "admin",
  "staff",
  "pet_owner",
  "veterinarian",
);

router.get("/", protect, appointmentRoles, c.getAppointments);
router.get("/:id", protect, appointmentRoles, c.getAppointment);
router.post("/", protect, appointmentRoles, c.createAppointment);
router.patch("/:id", protect, appointmentRoles, c.updateAppointment);
router.delete("/:id", protect, appointmentRoles, c.deleteAppointment);

module.exports = router;
