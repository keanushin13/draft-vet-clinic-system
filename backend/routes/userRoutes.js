// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

const { protect, authorizeRoles } = require("../middleware/auth");

const {
  registerUser,
  verifyEmail,
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  forgotPassword,
  getResetPasswordPage,
  resetPassword,
  unlockAccount,
  sendUnlockEmail,
  deleteUser,
  updatePassword,
  getUsers,
  createUser,
  updateUserAdmin,
  getMe,
  updateMe,
  adminVerifyUser,
  getSetPasswordPage,
  setPassword,
} = require("../controllers/userController");

/* =====================
   CSRF TOKEN
   (Frontend calls this ONCE)
===================== */
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

/* =====================
   AUTH (NO CSRF)
===================== */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* =====================
   LOGIN + OTP (NO CSRF)
===================== */
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/resend-login-otp", resendLoginOtp);

/* =====================
   PASSWORD RESET (NO CSRF)
   Email-based flow
===================== */
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", getResetPasswordPage);
router.post("/reset-password/:token", resetPassword);

/* =====================
   EMAIL LINKS (NO CSRF)
===================== */
router.get("/verify-email/:token", verifyEmail);
router.get("/set-password/:token", getSetPasswordPage);
router.post("/set-password/:token", setPassword);
router.get("/unlock/:token", unlockAccount);
router.post("/send-unlock-email", sendUnlockEmail);

/* =====================
   USER MANAGEMENT (CSRF PROTECTED)
   Logged-in actions
===================== */
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteUser);
router.post("/update-password", protect, updatePassword);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

// Admin CRUD
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.post("/create", protect, authorizeRoles("admin"), createUser);
router.put("/:id", protect, authorizeRoles("admin"), updateUserAdmin);
router.patch("/:id/verify", protect, authorizeRoles("admin"), adminVerifyUser);

module.exports = router;
