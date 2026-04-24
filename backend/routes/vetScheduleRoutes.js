const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/vetScheduleController");

router.get(
  "/vets",
  protect,
  authorizeRoles("pet_owner", "staff", "admin", "veterinarian"),
  c.getAvailableVets,
);

router.get("/me", protect, authorizeRoles("veterinarian"), c.getMySchedule);

router.put(
  "/me",
  protect,
  authorizeRoles("veterinarian"),
  c.replaceMyWeeklySchedule,
);

router.post(
  "/me/exceptions",
  protect,
  authorizeRoles("veterinarian"),
  c.createMyScheduleException,
);

router.get(
  "/:vetId/available-slots",
  protect,
  authorizeRoles("pet_owner", "staff", "admin", "veterinarian"),
  c.getAvailableSlots,
);

router.get(
  "/:vetId",
  protect,
  authorizeRoles("staff", "admin", "veterinarian"),
  c.getVetSchedule,
);

router.put(
  "/:vetId/weekly",
  protect,
  authorizeRoles("staff", "admin", "veterinarian"),
  c.replaceVetWeeklySchedule,
);

router.post(
  "/:vetId/exceptions",
  protect,
  authorizeRoles("staff", "admin", "veterinarian"),
  c.createScheduleException,
);

router.delete(
  "/exceptions/:id",
  protect,
  authorizeRoles("staff", "admin", "veterinarian"),
  c.deleteScheduleException,
);

module.exports = router;
