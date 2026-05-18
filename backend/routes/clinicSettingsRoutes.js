const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/clinicSettingsController");

router.get("/", protect, c.getClinicSettings);
router.put("/", protect, authorizeRoles("admin", "staff"), c.updateClinicSettings);

module.exports = router;
