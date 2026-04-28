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
router.get(
  "/:id/billing-summary",
  protect,
  appointmentRoles,
  c.getAppointmentBillingSummary,
);
router.post("/", protect, appointmentRoles, c.createAppointment);
router.patch("/:id", protect, appointmentRoles, c.updateAppointment);
router.delete("/:id", protect, appointmentRoles, c.deleteAppointment);
router.post(
  "/:id/inventory-usage",
  protect,
  appointmentRoles,
  c.addAppointmentInventoryUsage,
);
router.delete(
  "/:id/inventory-usage/:usageId",
  protect,
  appointmentRoles,
  c.deleteAppointmentInventoryUsage,
);

module.exports = router;
