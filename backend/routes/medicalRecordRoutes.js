const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/medicalRecordController");

router.get("/", protect, c.getMedicalRecords);
router.get("/:id", protect, c.getMedicalRecord);
router.post(
  "/",
  protect,
  authorizeRoles("veterinarian"),
  c.createMedicalRecord,
);
router.put(
  "/:id",
  protect,
  authorizeRoles("veterinarian"),
  c.updateMedicalRecord,
);

module.exports = router;
