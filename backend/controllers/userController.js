const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const sendEmail = require("../utils/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET || "pawcruz_dev_secret";
const JWT_EXPIRES_IN = "7d";

// ===================== CONFIG =====================
const MAX_ATTEMPTS = 5;
const TIME_EXPIRATION = 5 * 60 * 1000; // 5 minutes
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
const PUBLIC_SERVER_URL =
  process.env.PUBLIC_SERVER_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

// ===================== REGISTER USER =====================
// POST /api/users/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({
        message: "Username must contain letters and numbers only",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include a letter, number, and special character",
      });
    }

    const allowedRoles = ["pet_owner", "veterinarian", "staff"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const userExists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        isVerified: false,
        emailVerificationToken: emailToken,
        emailVerificationExpires: new Date(Date.now() + TIME_EXPIRATION),
      },
    });

    const verifyLink = `${PUBLIC_SERVER_URL}/api/users/verify-email/${emailToken}`;

    await sendEmail(
      email,
      "Verify Your PawCruz Account",
      `<h2>Email Verification</h2><p>Click the link below to verify your account:</p><a href="${verifyLink}">Verify Email</a><p>This link expires in 5 minutes.</p>`,
    );

    return res.status(201).json({
      message: "Registration successful. Please check your email to verify.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== VERIFY EMAIL =====================
// GET /api/users/verify-email/:token
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      const message = "Invalid or expired verification link";
      if (req.method === "GET") {
        return res.status(400).send(
          renderStatusPage({
            title: "Verification Failed",
            message,
            tone: "error",
          }),
        );
      }
      return res.status(400).json({ message });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    const message =
      "Email verified successfully. Return to the app and log in.";
    if (req.method === "GET") {
      return res.status(200).send(
        renderStatusPage({
          title: "Email Verified",
          message,
          tone: "success",
        }),
      );
    }
    res.status(200).json({ message });
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== LOGIN USER =====================
// POST /api/users/login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      return res
        .status(429)
        .json({ message: "Account locked. Check your email to unlock." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const newAttempts = user.loginAttempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        const unlockToken = crypto.randomBytes(32).toString("hex");
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lockUntil: new Date(Date.now() + TIME_EXPIRATION),
            loginAttempts: 0,
            unlockToken,
            unlockTokenExpires: new Date(Date.now() + TIME_EXPIRATION),
          },
        });
        return res
          .status(429)
          .json({ message: "Too many attempts. Account locked." });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: newAttempts },
      });

      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first." });
    }

    // OTP disabled — issue JWT directly
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0 },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== FORGOT PASSWORD =====================
// POST /api/users/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link was sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: new Date(Date.now() + TIME_EXPIRATION),
        passwordResetUsed: false,
      },
    });

    const resetLink = `${PUBLIC_SERVER_URL}/api/users/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Your PawCruz Password",
      `<h2>Password Reset</h2><p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a><p>This link expires in 5 minutes.</p>`,
    );

    res
      .status(200)
      .json({ message: "If the email exists, a reset link was sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== RESET PASSWORD PAGE =====================
// GET /api/users/reset-password/:token
exports.getResetPasswordPage = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
        passwordResetUsed: false,
      },
    });

    if (!user) {
      return res.status(400).send(
        renderStatusPage({
          title: "Reset Link Invalid",
          message: "This reset link has already been used or expired.",
          tone: "error",
        }),
      );
    }

    return res.status(200).send(renderResetPasswordPage(token));
  } catch (error) {
    console.error("Reset Password Page Error:", error);
    return res.status(500).send(
      renderStatusPage({
        title: "Reset Failed",
        message: "Server error",
        tone: "error",
      }),
    );
  }
};

// ===================== RESET PASSWORD =====================
// POST /api/users/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const isBrowserForm = req.is("application/x-www-form-urlencoded");

    if (!newPassword) {
      if (isBrowserForm)
        return res.status(400).send(
          renderResetPasswordPage(token, {
            error: "New password is required.",
          }),
        );
      return res.status(400).json({ message: "New password is required" });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      if (isBrowserForm)
        return res.status(400).send(
          renderResetPasswordPage(token, {
            error: "Passwords do not match.",
          }),
        );
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      const message =
        "Password must be at least 8 characters and include a letter, number, and special character";
      if (isBrowserForm)
        return res
          .status(400)
          .send(renderResetPasswordPage(token, { error: message }));
      return res.status(400).json({ message });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
        passwordResetUsed: false,
      },
    });

    if (!user) {
      const message = "This reset link has already been used or expired";
      if (isBrowserForm)
        return res.status(400).send(
          renderStatusPage({
            title: "Reset Link Invalid",
            message,
            tone: "error",
          }),
        );
      return res.status(400).json({ message });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 10),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        passwordResetUsed: true,
      },
    });

    const message = "Password reset successful. Return to the app and log in.";
    if (isBrowserForm)
      return res.status(200).send(
        renderStatusPage({
          title: "Password Updated",
          message,
          tone: "success",
        }),
      );
    res.status(200).json({ message });
  } catch (error) {
    console.error("Reset Password Error:", error);
    if (req.is("application/x-www-form-urlencoded")) {
      return res.status(500).send(
        renderStatusPage({
          title: "Reset Failed",
          message: "Server error",
          tone: "error",
        }),
      );
    }
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== VERIFY LOGIN OTP =====================
// POST /api/users/verify-login-otp
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      !user.otp ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isValid = await bcrypt.compare(otp, user.otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpires: null },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify Login OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== RESEND LOGIN OTP =====================
// POST /api/users/resend-login-otp
exports.resendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP session expired. Please login again." });
    }

    const otp = generateOtp();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: await bcrypt.hash(otp, 10),
        otpExpires: new Date(Date.now() + TIME_EXPIRATION),
      },
    });

    await sendOtpEmail(user.email, otp, "Your Login OTP (Resent)");

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend Login OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== UNLOCK ACCOUNT =====================
exports.unlockAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        unlockToken: token,
        unlockTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      const message = "Invalid or expired link";
      if (req.method === "GET")
        return res.status(400).send(
          renderStatusPage({
            title: "Unlock Failed",
            message,
            tone: "error",
          }),
        );
      return res.status(400).json({ message });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lockUntil: null,
        loginAttempts: 0,
        unlockToken: null,
        unlockTokenExpires: null,
      },
    });

    const message =
      "Account unlocked successfully. Return to the app and log in.";
    if (req.method === "GET")
      return res.status(200).send(
        renderStatusPage({
          title: "Account Unlocked",
          message,
          tone: "success",
        }),
      );
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Unlock Account Error:", error);
    if (req.method === "GET")
      return res.status(500).send(
        renderStatusPage({
          title: "Unlock Failed",
          message: "Server error",
          tone: "error",
        }),
      );
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== SEND UNLOCK EMAIL =====================
// POST /api/users/send-unlock-email
exports.sendUnlockEmail = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.lockUntil || user.lockUntil < new Date()) {
      return res.status(400).json({ message: "Account is not locked" });
    }

    const unlockToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        unlockToken,
        unlockTokenExpires: new Date(Date.now() + TIME_EXPIRATION),
      },
    });

    const unlockLink = `${PUBLIC_SERVER_URL}/api/users/unlock/${unlockToken}`;

    await sendEmail(
      user.email,
      "Unlock Your PawCruz Account",
      `<h2>Account Locked</h2><p>Click the link below to unlock your account:</p><a href="${unlockLink}">Unlock Account</a><p>This link expires in 5 minutes.</p>`,
    );

    return res.status(200).json({ message: "Unlock email sent" });
  } catch (error) {
    console.error("Send Unlock Email Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===================== DELETE USER =====================
// DELETE /api/users/delete/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== UPDATE PASSWORD =====================
// POST /api/users/update-password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: await bcrypt.hash(newPassword, 10) },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== GET ME =====================
// GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        isVerified: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== UPDATE ME =====================
// PUT /api/users/me
exports.updateMe = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, email, username } = req.body;
    const id = req.user.id;

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (username) {
      const taken = await prisma.user.findFirst({
        where: { username, NOT: { id } },
      });
      if (taken)
        return res.status(409).json({ message: "Username already taken" });
    }
    if (email) {
      const taken = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (taken)
        return res.status(409).json({ message: "Email already in use" });
    }

    const data = {};
    if (firstName !== undefined) data.firstName = firstName || null;
    if (lastName !== undefined) data.lastName = lastName || null;
    if (phone !== undefined) data.phone = phone || null;
    if (address !== undefined) data.address = address || null;
    if (email) data.email = email;
    if (username) data.username = username;

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        isVerified: true,
        createdAt: true,
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== GET ALL USERS (Admin) =====================
// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== CREATE USER (Admin) =====================
// POST /api/users/create
exports.createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      address,
    } = req.body;

    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "username, email, password, and role are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with a letter, number, and special character",
      });
    }
    const allowedRoles = ["pet_owner", "veterinarian", "staff", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing)
      return res
        .status(409)
        .json({ message: "Username or email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        role,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        address: address || null,
        isVerified: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        isVerified: true,
        createdAt: true,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== UPDATE USER (Admin) =====================
// PUT /api/users/:id
exports.updateUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      role,
      firstName,
      lastName,
      phone,
      address,
      password,
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (username && username !== user.username) {
      const taken = await prisma.user.findFirst({
        where: { username, NOT: { id } },
      });
      if (taken)
        return res.status(409).json({ message: "Username already taken" });
    }
    if (email && email !== user.email) {
      const taken = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (taken)
        return res.status(409).json({ message: "Email already in use" });
    }

    const data = {};
    if (username) data.username = username;
    if (email) data.email = email;
    if (role) data.role = role;
    if (firstName !== undefined) data.firstName = firstName || null;
    if (lastName !== undefined) data.lastName = lastName || null;
    if (phone !== undefined) data.phone = phone || null;
    if (address !== undefined) data.address = address || null;
    if (password) {
      if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters with a letter, number, and special character",
        });
      }
      data.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        isVerified: true,
        createdAt: true,
      },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== HELPERS =====================
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderStatusPage = ({ title, message, tone }) => {
  const palette =
    tone === "success"
      ? { accent: "#0f766e", chip: "#ccfbf1", card: "#f0fdfa" }
      : { accent: "#b91c1c", chip: "#fee2e2", card: "#fef2f2" };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #e0f2fe, #f8fafc); color: #0f172a; }
    .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { width: 100%; max-width: 460px; background: ${palette.card}; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 20px; padding: 28px; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12); }
    .chip { display: inline-block; padding: 6px 12px; border-radius: 999px; background: ${palette.chip}; color: ${palette.accent}; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
    h1 { margin: 14px 0 10px; font-size: 28px; }
    p { margin: 0; font-size: 16px; line-height: 1.6; color: #334155; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="chip">PawCruz</div>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
    </div>
  </div>
</body>
</html>`;
};

const renderResetPasswordPage = (token, { error = "" } = {}) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #dbeafe, #f8fafc); color: #0f172a; }
    .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { width: 100%; max-width: 460px; background: #ffffff; border-radius: 20px; padding: 28px; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12); }
    h1 { margin: 0 0 10px; font-size: 28px; }
    p { margin: 0 0 18px; color: #475569; line-height: 1.6; }
    label { display: block; margin: 12px 0 6px; font-size: 14px; font-weight: 700; }
    input { width: 100%; box-sizing: border-box; padding: 14px 16px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 15px; }
    button { width: 100%; margin-top: 18px; padding: 14px 16px; border: 0; border-radius: 12px; background: #0f766e; color: #ffffff; font-size: 16px; font-weight: 700; cursor: pointer; }
    .help { margin-top: 14px; font-size: 13px; color: #64748b; }
    .error { margin: 12px 0 0; color: #b91c1c; font-weight: 700; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>Reset Password</h1>
      <p>Enter a new password for your account.</p>
      <form method="POST" action="/api/users/reset-password/${escapeHtml(token)}">
        <label for="newPassword">New Password</label>
        <input id="newPassword" name="newPassword" type="password" minlength="8" required />
        <label for="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" minlength="8" required />
        ${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
        <button type="submit">Update Password</button>
      </form>
      <p class="help">After updating your password, return to the mobile app and sign in again.</p>
    </div>
  </div>
</body>
</html>`;

const sendOtpEmail = async (email, otp, subject) => {
  await sendEmail(
    email,
    subject,
    `<h2>Login Verification</h2><p>Your OTP code is:</p><h1 style="letter-spacing:4px;">${otp}</h1><p>This code expires in ${TIME_EXPIRATION / 60000} minutes.</p>`,
  );
};
