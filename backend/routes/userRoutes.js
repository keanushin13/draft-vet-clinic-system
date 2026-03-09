// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

const {
  registerUser,
  verifyEmail,
  loginUser,
  verifyLoginOtp,
  resendLoginOtp,
  forgotPassword,
  resetPassword,
  unlockAccount,
  sendUnlockEmail,
  deleteUser,
  updatePassword,
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
router.post("/reset-password/:token", resetPassword);

/* =====================
   EMAIL LINKS (NO CSRF)
===================== */
router.get("/verify-email/:token", verifyEmail);
router.get("/unlock/:token", unlockAccount);
router.post("/send-unlock-email", sendUnlockEmail);

/* =====================
   USER MANAGEMENT (CSRF PROTECTED)
   Logged-in actions
===================== */
router.delete("/delete/:id", csrfProtection, deleteUser);
router.post("/update-password", csrfProtection, updatePassword);

module.exports = router;