const router = require("express").Router();
const { protect } = require("../middleware/auth");
const c = require("../controllers/appointmentController");

router.get("/", protect, c.getAppointments);
router.get("/:id", protect, c.getAppointment);
router.post("/", protect, c.createAppointment);
router.patch("/:id", protect, c.updateAppointment);
router.delete("/:id", protect, c.deleteAppointment);

module.exports = router;
