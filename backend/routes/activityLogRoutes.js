const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/activityLogController");

router.get("/", protect, authorizeRoles("admin", "staff"), c.getActivityLogs);

module.exports = router;
