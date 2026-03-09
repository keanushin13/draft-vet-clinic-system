const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
    },

    role: {
        type: String,
        enum: ["admin", "veterinarian", "staff", "pet_owner"],
        default: "pet_owner",
    },

    // Email verification
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpires: {
        type: Date
    },

    // Login OTP
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },

    // Forgot password
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },

    passwordResetUsed: {
        type: Boolean,
        default: false
    },

    // Brute force protection
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },

    // Unlock account
    unlockToken: {
        type: String
    },
    unlockTokenExpires: {
        type: Date
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);