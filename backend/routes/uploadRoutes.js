const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/auth");
const { uploadAvatar } = require("../controllers/uploadController");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, GIF, WEBP) are allowed"));
    }
  },
});

router.post("/avatar", protect, (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, uploadAvatar);

module.exports = router;
