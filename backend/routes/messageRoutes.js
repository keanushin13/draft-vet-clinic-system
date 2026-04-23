const router = require("express").Router();
const { protect } = require("../middleware/auth");
const c = require("../controllers/messageController");

router.get("/threads", protect, c.getThreads);
router.get("/:userId", protect, c.getThread);
router.post("/", protect, c.sendMessage);
router.patch("/:id", protect, c.updateMessage);
router.delete("/:id", protect, c.deleteMessage);
router.patch("/:id/read", protect, c.markRead);

module.exports = router;
