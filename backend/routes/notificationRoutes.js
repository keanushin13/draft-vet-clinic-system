const router = require("express").Router();
const { protect } = require("../middleware/auth");
const c = require("../controllers/notificationController");

router.get("/", protect, c.getNotifications);
router.patch("/mark-all-read", protect, c.markAllRead);
router.patch("/:id/read", protect, c.markOneRead);

module.exports = router;
