const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/statsController");

router.get("/admin", protect, authorizeRoles("admin"), c.getAdminStats);
router.get(
  "/staff",
  protect,
  authorizeRoles("admin", "staff"),
  c.getStaffStats,
);
router.get("/vet", protect, authorizeRoles("veterinarian"), c.getVetStats);
router.get(
  "/pet-owner",
  protect,
  authorizeRoles("pet_owner"),
  c.getPetOwnerStats,
);

module.exports = router;
