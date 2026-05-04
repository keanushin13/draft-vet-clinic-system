const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/medicalRecordController");

router.get(
  "/",
  protect,
  authorizeRoles("admin", "staff", "veterinarian", "pet_owner"),
  c.getMedicalRecords,
);
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "staff", "veterinarian", "pet_owner"),
  c.getMedicalRecord,
);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "staff", "veterinarian"),
  c.createMedicalRecord,
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "staff", "veterinarian"),
  c.updateMedicalRecord,
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "staff", "veterinarian"),
  c.deleteMedicalRecord,
);
router.patch(
  "/:id/restore",
  protect,
  authorizeRoles("admin", "staff", "veterinarian"),
  c.restoreMedicalRecord,
);
router.post(
  "/:id/ai-insight",
  protect,
  authorizeRoles("admin", "staff", "veterinarian", "pet_owner"),
  c.getAiInsight,
);

module.exports = router;
