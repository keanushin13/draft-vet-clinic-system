const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// ===================== CONFIG =====================
const MAX_ATTEMPTS = 5;
const TIME_EXPIRATION = 5 * 60 * 1000; // 5 minutes

// ===================== REGISTER USER =====================
// POST /api/users/register
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        /* =========================
           BASIC REQUIRED CHECK
        ========================== */
        if (!username || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        /* =========================
           USERNAME VALIDATION
           Letters & numbers only
        ========================== */
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return res.status(400).json({
                message: "Username must contain letters and numbers only",
            });
        }

        /* =========================
           EMAIL VALIDATION
        ========================== */
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }

        /* =========================
           PASSWORD VALIDATION
           - 8 chars
           - letter
           - number
           - special char
        ========================== */
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and include a letter, number, and special character",
            });
        }

        /* =========================
           ROLE VALIDATION
        ========================== */
        const allowedRoles = ["pet_owner", "veterinarian", "staff"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role selected",
            });
        }

        /* =========================
           CHECK IF USER EXISTS
        ========================== */
        const userExists = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (userExists) {
            return res.status(400).json({
                message: "Email or username already exists",
            });
        }

        /* =========================
           HASH PASSWORD
        ========================== */
        const hashedPassword = await bcrypt.hash(password, 10);

        /* =========================
           EMAIL VERIFICATION TOKEN
        ========================== */
        const emailToken = crypto.randomBytes(32).toString("hex");

        await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            emailVerificationToken: emailToken,
            emailVerificationExpires: Date.now() + 5 * 60 * 1000, // ✅ 5 MINUTES
        });

        /* =========================
           SEND VERIFICATION EMAIL
        ========================== */
        const verifyLink = `${process.env.CLIENT_URL}/verify-email/${emailToken}`;

        await sendEmail(
            email,
            "Verify Your PetCare Account",
            `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyLink}">Verify Email</a>
        <p>This link expires in 5 minutes.</p>
      `
        );

        return res.status(201).json({
            message: "Registration successful. Please check your email to verify.",
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ===================== VERIFY EMAIL =====================
// GET /api/users/verify-email/:token
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification link"
            });
        }

        // ✅ Mark email as verified
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();

        res.status(200).json({
            message: "Email verified successfully. You may now log in."
        });

    } catch (error) {
        console.error("Verify Email Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===================== LOGIN USER (PASSWORD STEP) =====================
// POST /api/users/login
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // 🔒 ACCOUNT LOCKED
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(429).json({
                message: "Account locked. Check your email to unlock."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // ❌ WRONG PASSWORD
        if (!isMatch) {
            user.loginAttempts += 1;

            if (user.loginAttempts >= MAX_ATTEMPTS) {
                const unlockToken = crypto.randomBytes(32).toString("hex");

                user.lockUntil = Date.now() + TIME_EXPIRATION;
                user.loginAttempts = 0;
                user.unlockToken = unlockToken;
                user.unlockTokenExpires = Date.now() + TIME_EXPIRATION;
                await user.save();

                return res.status(429).json({
                    message: "Too many attempts. Account locked."
                });
            }

            await user.save();
            return res.status(401).json({ message: "Invalid username or password" });
        }


        // ❗ EMAIL NOT VERIFIED
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email first."
            });
        }

        // ✅ PASSWORD OK → SEND OTP
        const otp = generateOtp();
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = Date.now() + TIME_EXPIRATION;
        user.loginAttempts = 0;
        await user.save();

        await sendOtpEmail(user.email, otp, "Your Login OTP");

        res.status(200).json({
            message: "OTP sent to email",
            requiresOtp: true,
            email: user.email
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

        const user = await User.findOne({ email });
        if (!user) {
            // security: don't reveal if email exists
            return res.status(200).json({
                message: "If the email exists, a reset link was sent"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
        user.passwordResetUsed = false; // 👈 allow new reset
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Reset Your PawCruz Password",
            `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link expires in 5 minutes.</p>
        `
        );

        res.status(200).json({
            message: "If the email exists, a reset link was sent"
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===================== RESET PASSWORD =====================
// POST /api/users/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
            passwordResetUsed: false   // 👈 BLOCK reused links
        });

        if (!user) {
            return res.status(400).json({
                message: "This reset link has already been used or expired"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.passwordResetUsed = true;
        await user.save();

        res.status(200).json({
            message: "Password reset successful. You may now log in."
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// ===================== VERIFY LOGIN OTP =====================
// POST /api/users/verify-login-otp
exports.verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        const isValid = await bcrypt.compare(otp, user.otp);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "OTP session expired. Please login again."
            });
        }

        const otp = generateOtp();
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = Date.now() + TIME_EXPIRATION;
        await user.save();

        await sendOtpEmail(user.email, otp, "Your Login OTP (Resent)");

        res.status(200).json({ message: "OTP resent successfully" });

    } catch (error) {
        console.error("Resend Login OTP Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===================== UNLOCK ACCOUNT =====================
exports.unlockAccount = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
        unlockToken: token,
        unlockTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired link" });
    }

    user.lockUntil = null;
    user.loginAttempts = 0;
    user.unlockToken = undefined;
    user.unlockTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Account unlocked successfully" });
};

// ===================== SEND UNLOCK EMAIL =====================
// POST /api/users/send-unlock-email
exports.sendUnlockEmail = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.lockUntil || user.lockUntil < Date.now()) {
            return res.status(400).json({ message: "Account is not locked" });
        }

        // Generate new unlock token
        const unlockToken = crypto.randomBytes(32).toString("hex");
        user.unlockToken = unlockToken;
        user.unlockTokenExpires = Date.now() + TIME_EXPIRATION;
        await user.save();

        const unlockLink = `${process.env.CLIENT_URL}/unlock-account/${unlockToken}`;

        await sendEmail(
            user.email,
            "Unlock Your PetCare Account",
            `
        <h2>Account Locked</h2>
        <p>Click the link below to unlock your account:</p>
        <a href="${unlockLink}">Unlock Account</a>
        <p>This link expires in 5 minutes.</p>
      `
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

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(id);

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
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===================== HELPERS =====================
const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async (email, otp, subject) => {
    await sendEmail(
        email,
        subject,
        `
      <h2>Login Verification</h2>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing:4px;">${otp}</h1>
      <p>This code expires in ${TIME_EXPIRATION / 60000} minutes.</p>
    `
    );
};