const router = require("express").Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const c = require("../controllers/notificationController");

router.get("/", protect, c.getNotifications);
router.patch("/mark-all-read", protect, c.markAllRead);
router.post(
  "/broadcast",
  protect,
  authorizeRoles("admin", "staff"),
  c.broadcastNotification,
);
router.patch("/:id/read", protect, c.markOneRead);

module.exports = router;
