const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/medicalRecordController");

router.get("/", protect, c.getMedicalRecords);
router.get("/:id", protect, c.getMedicalRecord);
router.post(
  "/",
  protect,
  authorizeRoles("veterinarian", "pet_owner"),
  c.createMedicalRecord,
);
router.put(
  "/:id",
  protect,
  authorizeRoles("veterinarian", "pet_owner"),
  c.updateMedicalRecord,
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("veterinarian", "pet_owner"),
  c.deleteMedicalRecord,
);

module.exports = router;
