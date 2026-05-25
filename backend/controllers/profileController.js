const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");
const logActivity = require("../utils/logActivity");
const sendEmail = require("../utils/sendEmail");

const PUBLIC_SERVER_URL =
  process.env.PUBLIC_SERVER_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
const PHONE_REGEX = /^\d{11}$/;

const userSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
  phone: true,
  address: true,
  profileCompleted: true,
  isActive: true,
  isVerified: true,
  deletedAt: true,
  createdAt: true,
  _count: { select: { pets: true } },
};

// GET /api/users  (admin: all; staff: pet_owner only)
exports.getUsers = async (req, res) => {
  try {
    const { role, showDeleted, page = 1, limit = 10, q } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (req.user.role === "staff") {
      where.role = "pet_owner";
    } else if (role) {
      where.role = role;
    }

    // Hide soft-deleted by default; admin can request them
    if (showDeleted === "true" && req.user.role === "admin") {
      // show all including deleted
    } else {
      where.deletedAt = null;
    }

    if (q) {
      where.OR = [
        { username: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ];
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

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
        profileImage: true,
        profileCompleted: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/me
exports.updateMe = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      email,
      username,
      profileImage,
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        role: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        address: true,
        profileCompleted: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPetOwner = existingUser.role === "pet_owner";

    if (isPetOwner && email && email !== existingUser.email) {
      return res.status(400).json({ message: "Email cannot be changed" });
    }

    if (isPetOwner && phone && phone !== existingUser.phone) {
      return res
        .status(400)
        .json({ message: "Phone number cannot be changed" });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!isPetOwner && phone && !PHONE_REGEX.test(String(phone))) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 11 digits" });
    }

    const normalizedFirstName =
      firstName !== undefined ? String(firstName).trim() : undefined;
    const normalizedLastName =
      lastName !== undefined ? String(lastName).trim() : undefined;
    const normalizedAddress =
      address !== undefined ? String(address).trim() : undefined;

    if (normalizedFirstName !== undefined && normalizedFirstName.length > 20) {
      return res
        .status(400)
        .json({ message: "First name must be 20 characters or less" });
    }

    if (normalizedLastName !== undefined && normalizedLastName.length > 20) {
      return res
        .status(400)
        .json({ message: "Last name must be 20 characters or less" });
    }

    if (normalizedAddress !== undefined && normalizedAddress.length > 50) {
      return res
        .status(400)
        .json({ message: "Address must be 50 characters or less" });
    }

    if (username) {
      const usernameTaken = await prisma.user.findFirst({
        where: { username, NOT: { id: req.user.id } },
      });
      if (usernameTaken) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    if (email) {
      const emailTaken = await prisma.user.findFirst({
        where: { email, NOT: { id: req.user.id } },
      });
      if (emailTaken) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    if (!isPetOwner && phone) {
      const phoneTaken = await prisma.user.findFirst({
        where: { phone, NOT: { id: req.user.id } },
      });
      if (phoneTaken) {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }

    const finalFirstName =
      normalizedFirstName !== undefined
        ? normalizedFirstName
        : existingUser.firstName;
    const finalLastName =
      normalizedLastName !== undefined
        ? normalizedLastName
        : existingUser.lastName;
    const finalAddress =
      normalizedAddress !== undefined
        ? normalizedAddress
        : existingUser.address;

    const hasCompleteProfile =
      Boolean(finalFirstName) &&
      Boolean(finalLastName) &&
      Boolean(finalAddress);

    if (isPetOwner && !existingUser.profileCompleted && !hasCompleteProfile) {
      return res.status(400).json({
        message:
          "Please complete your profile first (first name, last name, and address are required)",
      });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName:
          normalizedFirstName !== undefined
            ? normalizedFirstName || null
            : undefined,
        lastName:
          normalizedLastName !== undefined
            ? normalizedLastName || null
            : undefined,
        phone: !isPetOwner && phone !== undefined ? phone || null : undefined,
        address:
          normalizedAddress !== undefined
            ? normalizedAddress || null
            : undefined,
        email: !isPetOwner && email ? email : undefined,
        username,
        profileImage,
        profileCompleted: isPetOwner
          ? hasCompleteProfile
          : existingUser.profileCompleted,
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
        profileImage: true,
        profileCompleted: true,
        isActive: true,
      },
    });

    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/create  (admin/staff creates a user account)
exports.createUser = async (req, res) => {
  try {
    const { username, email, role, firstName, lastName, phone, address } =
      req.body;

    // field-level validation
    const errors = {};
    if (!username) errors.username = "Username is required";
    if (!email) errors.email = "Email is required";
    else if (!validator.isEmail(email)) errors.email = "Invalid email format";
    if (!role) errors.role = "Role is required";

    const allowedRoles = ["pet_owner", "veterinarian", "staff", "admin"];
    if (role && !allowedRoles.includes(role))
      errors.role = "Invalid role selected";

    if (req.user.role === "staff" && role && role !== "pet_owner")
      return res
        .status(403)
        .json({ message: "Staff can only create pet owner accounts" });

    if (phone && !PHONE_REGEX.test(String(phone)))
      errors.phone = "Phone must be exactly 11 digits";

    if (Object.keys(errors).length)
      return res.status(400).json({ message: "Validation failed", errors });

    // duplicate checks — report per field
    const existingUsername = await prisma.user.findFirst({ where: { username } });
    if (existingUsername)
      return res.status(409).json({
        message: "Validation failed",
        errors: { username: "Username is already taken" },
      });

    const existingEmail = await prisma.user.findFirst({ where: { email } });
    if (existingEmail)
      return res.status(409).json({
        message: "Validation failed",
        errors: { email: "Email is already in use" },
      });

    if (phone) {
      const existingPhone = await prisma.user.findFirst({ where: { phone } });
      if (existingPhone)
        return res.status(409).json({
          message: "Validation failed",
          errors: { phone: "Phone number is already in use" },
        });
    }

    const fn = firstName?.trim() || null;
    const ln = lastName?.trim() || null;
    const addr = address?.trim() || null;
    const isPetOwner = role === "pet_owner";
    const profileCompleted = isPetOwner ? Boolean(fn && ln && addr) : false;

    // Placeholder password — unusable until user sets a real one via email link
    const placeholderPassword = await bcrypt.hash(
      crypto.randomBytes(32).toString("hex"),
      10,
    );
    const setPasswordToken = crypto.randomBytes(32).toString("hex");

    const created = await prisma.user.create({
      data: {
        username,
        email,
        password: placeholderPassword,
        role,
        firstName: fn,
        lastName: ln,
        phone: phone || null,
        address: addr,
        isVerified: false,
        isActive: true,
        profileCompleted,
        emailVerificationToken: setPasswordToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      select: { id: true, username: true },
    });

    logActivity({
      action: `Created ${role} account: ${username}`,
      target: created.id,
      staffId: req.user.id,
    }).catch(() => {});

    const setPasswordLink = `${PUBLIC_SERVER_URL}/api/users/set-password/${setPasswordToken}`;
    sendEmail(
      email,
      "Set Your PawCruz Password",
      `<h2>Welcome to PawCruz!</h2>
<p>An account has been created for you. Click the button below to set your password and activate your account.</p>
<p><a href="${setPasswordLink}" style="display:inline-block;padding:12px 24px;background:#0f766e;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Set Password</a></p>
<p>This link expires in 24 hours. If you did not expect this email, you can safely ignore it.</p>`,
    ).catch((err) => console.error("Set-password email failed:", err));

    const createdWithMeta = await prisma.user.findUnique({
      where: { id: created.id },
      select: userSelect,
    });

    res.status(201).json(createdWithMeta);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error", error: e?.message || "Unknown error" });
  }
};

// PUT /api/users/:id  (admin edits any user, staff edits pet_owner only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phone,
      address,
      role,
      email,
      username,
      password,
    } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "User not found" });

    if (req.user.role === "staff" && existing.role !== "pet_owner") {
      return res
        .status(403)
        .json({ message: "Staff can only edit pet owner clients" });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (username) {
      const usernameTaken = await prisma.user.findFirst({
        where: { username, NOT: { id } },
      });
      if (usernameTaken) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    if (email) {
      const emailTaken = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (emailTaken) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    if (phone) {
      if (!PHONE_REGEX.test(String(phone))) {
        return res
          .status(400)
          .json({ message: "Phone number must be exactly 11 digits" });
      }
      const phoneTaken = await prisma.user.findFirst({
        where: { phone, NOT: { id } },
      });
      if (phoneTaken) {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }

    if (req.user.role === "staff" && role && role !== "pet_owner") {
      return res
        .status(403)
        .json({ message: "Staff can only set role to pet_owner" });
    }

    const data = {
      firstName,
      lastName,
      phone,
      address,
      role,
      email,
      username,
    };

    if (password) {
      if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ message: "Weak password" });
      }
      data.password = await bcrypt.hash(password, 10);
    }

    // Recalculate profileCompleted for pet_owner if names/address changed
    if (existing.role === "pet_owner") {
      const fn = (firstName ?? existing.firstName)?.trim();
      const ln = (lastName ?? existing.lastName)?.trim();
      const addr = (address ?? existing.address)?.trim();
      data.profileCompleted = Boolean(fn && ln && addr);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });

    await logActivity({
      action: `Updated user account: ${existing.username}`,
      target: id,
      staffId: req.user.id,
    });

    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/:id/toggle-active
exports.toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ message: "User not found" });

    if (req.user.role === "staff" && existing.role !== "pet_owner") {
      return res
        .status(403)
        .json({ message: "Staff can only manage pet owner clients" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !existing.isActive },
      select: userSelect,
    });

    await logActivity({
      action: `${updated.isActive ? "Activated" : "Suspended"} user: ${existing.username}`,
      target: id,
      staffId: req.user.id,
    });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/delete/:id — soft delete (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "User not found" });

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await logActivity({
      action: `Deleted user account: ${existing.username}`,
      target: id,
      staffId: req.user.id,
    });

    res.json({ message: "User deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/:id/restore — restore soft-deleted user (admin only)
exports.restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "User not found" });
    if (!existing.deletedAt)
      return res.status(400).json({ message: "User is not deleted" });

    const restored = await prisma.user.update({
      where: { id },
      data: { deletedAt: null },
      select: userSelect,
    });

    await logActivity({
      action: `Restored user account: ${existing.username}`,
      target: id,
      staffId: req.user.id,
    });

    res.json(restored);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/:id/send-reset-link — admin/staff sends a reset-password email
exports.sendResetLink = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const resetLink = `${PUBLIC_SERVER_URL}/api/users/reset-password/${resetToken}`;
    sendEmail(
      user.email,
      "Reset Your PawCruz Password",
      `<h2>Password Reset</h2>
<p>An admin has requested a password reset for your account. Click the button below to set a new password.</p>
<p><a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#0f766e;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a></p>
<p>This link expires in 24 hours. If you did not expect this email, you can safely ignore it.</p>`,
    ).catch((err) => console.error("Reset-password email failed:", err));

    res.json({ message: "Reset link sent" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/:id/reset-password — admin resets any user's password
exports.adminResetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({ message: "Weak password" });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "User not found" });

    await prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(newPassword, 10) },
    });

    await logActivity({
      action: `Reset password for user: ${existing.username}`,
      target: id,
      staffId: req.user.id,
    });

    res.json({ message: "Password reset successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── helpers ──────────────────────────────────────────────────────────────────

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
    body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#e0f2fe,#f8fafc);color:#0f172a}
    .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{width:100%;max-width:460px;background:${palette.card};border:1px solid rgba(15,23,42,.08);border-radius:20px;padding:28px;box-shadow:0 18px 50px rgba(15,23,42,.12)}
    .chip{display:inline-block;padding:6px 12px;border-radius:999px;background:${palette.chip};color:${palette.accent};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
    h1{margin:14px 0 10px;font-size:28px}
    p{margin:0;font-size:16px;line-height:1.6;color:#334155}
  </style>
</head>
<body>
  <div class="wrap"><div class="card">
    <div class="chip">PawCruz</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
  </div></div>
</body>
</html>`;
};

const renderSetPasswordPage = (token, { error = "" } = {}) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Set Password — PawCruz</title>
  <style>
    body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#dbeafe,#f8fafc);color:#0f172a}
    .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{width:100%;max-width:460px;background:#fff;border-radius:20px;padding:28px;box-shadow:0 18px 50px rgba(15,23,42,.12)}
    h1{margin:0 0 6px;font-size:26px}
    .subtitle{margin:0 0 20px;color:#475569;font-size:14px;line-height:1.5}
    label{display:block;margin:12px 0 6px;font-size:14px;font-weight:700}
    input{width:100%;box-sizing:border-box;padding:14px 16px;border:1px solid #cbd5e1;border-radius:12px;font-size:15px}
    button{width:100%;margin-top:18px;padding:14px 16px;border:0;border-radius:12px;background:#0f766e;color:#fff;font-size:16px;font-weight:700;cursor:pointer}
    .help{margin-top:14px;font-size:13px;color:#64748b}
    .error{margin:12px 0 0;color:#b91c1c;font-weight:700;font-size:14px}
  </style>
</head>
<body>
  <div class="wrap"><div class="card">
    <h1>Set Your Password</h1>
    <p class="subtitle">Choose a password to activate your PawCruz account.</p>
    <form method="POST" action="/api/users/set-password/${escapeHtml(token)}">
      <label for="newPassword">Password</label>
      <input id="newPassword" name="newPassword" type="password" minlength="8" required placeholder="At least 8 characters" />
      <label for="confirmPassword">Confirm Password</label>
      <input id="confirmPassword" name="confirmPassword" type="password" minlength="8" required placeholder="Repeat password" />
      ${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
      <button type="submit">Activate Account</button>
    </form>
    <p class="help">Must be at least 8 characters with a letter, number, and special character.</p>
  </div></div>
</body>
</html>`;

const renderResetPasswordPage = (token, { error = "" } = {}) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password — PawCruz</title>
  <style>
    body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#dbeafe,#f8fafc);color:#0f172a}
    .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{width:100%;max-width:460px;background:#fff;border-radius:20px;padding:28px;box-shadow:0 18px 50px rgba(15,23,42,.12)}
    h1{margin:0 0 6px;font-size:26px}
    .subtitle{margin:0 0 20px;color:#475569;font-size:14px;line-height:1.5}
    label{display:block;margin:12px 0 6px;font-size:14px;font-weight:700}
    input{width:100%;box-sizing:border-box;padding:14px 16px;border:1px solid #cbd5e1;border-radius:12px;font-size:15px}
    button{width:100%;margin-top:18px;padding:14px 16px;border:0;border-radius:12px;background:#0f766e;color:#fff;font-size:16px;font-weight:700;cursor:pointer}
    .help{margin-top:14px;font-size:13px;color:#64748b}
    .error{margin:12px 0 0;color:#b91c1c;font-weight:700;font-size:14px}
  </style>
</head>
<body>
  <div class="wrap"><div class="card">
    <h1>Reset Your Password</h1>
    <p class="subtitle">Enter a new password for your PawCruz account.</p>
    <form method="POST" action="/api/users/reset-password/${escapeHtml(token)}">
      <label for="newPassword">New Password</label>
      <input id="newPassword" name="newPassword" type="password" minlength="8" required placeholder="At least 8 characters" />
      <label for="confirmPassword">Confirm Password</label>
      <input id="confirmPassword" name="confirmPassword" type="password" minlength="8" required placeholder="Repeat password" />
      ${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
      <button type="submit">Reset Password</button>
    </form>
    <p class="help">Must be at least 8 characters with a letter, number, and special character.</p>
  </div></div>
</body>
</html>`;

// ─── set-password (public — no JWT) ──────────────────────────────────────────

// GET /api/users/set-password/:token
exports.getSetPasswordPage = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("[set-password GET] token:", token);

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
      select: { id: true, isVerified: true, emailVerificationExpires: true },
    });

    console.log("[set-password GET] token:", token.slice(0, 8), "user:", user?.id, "isVerified:", user?.isVerified, "expires:", user?.emailVerificationExpires);

    if (!user || (user.emailVerificationExpires && user.emailVerificationExpires < new Date())) {
      return res.status(400).send(
        renderStatusPage({
          title: "Link Invalid",
          message: "This set-password link has already been used or has expired.",
          tone: "error",
        }),
      );
    }

    if (user.isVerified) {
      return res.status(400).send(
        renderStatusPage({
          title: "Already Activated",
          message: "Your account is already activated. You can log in to the PawCruz app.",
          tone: "success",
        }),
      );
    }

    return res.send(renderSetPasswordPage(token));
  } catch (e) {
    console.error("getSetPasswordPage error:", e);
    return res.status(500).send(
      renderStatusPage({ title: "Error", message: `Server error: ${e?.message || "Unknown"}`, tone: "error" }),
    );
  }
};

// POST /api/users/set-password/:token
exports.setPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword) {
      return res.send(renderSetPasswordPage(token, { error: "Password is required." }));
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      return res.send(renderSetPasswordPage(token, { error: "Passwords do not match." }));
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.send(
        renderSetPasswordPage(token, {
          error: "Password must be at least 8 characters and include a letter, number, and special character.",
        }),
      );
    }

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
      select: { id: true, isVerified: true, emailVerificationExpires: true },
    });
    if (!user || (user.emailVerificationExpires && user.emailVerificationExpires < new Date())) {
      return res.status(400).send(
        renderStatusPage({
          title: "Link Invalid",
          message: "This set-password link has already been used or has expired.",
          tone: "error",
        }),
      );
    }

    if (user.isVerified) {
      return res.status(400).send(
        renderStatusPage({
          title: "Already Activated",
          message: "Your account is already activated. You can log in to the PawCruz app.",
          tone: "success",
        }),
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 10),
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return res.send(
      renderStatusPage({
        title: "Account Activated",
        message: "Password set successfully! You can now log in to the PawCruz app.",
        tone: "success",
      }),
    );
  } catch (e) {
    console.error("setPassword error:", e);
    return res.status(500).send(
      renderStatusPage({ title: "Error", message: `Server error: ${e?.message || "Unknown"}`, tone: "error" }),
    );
  }
};

// ─── reset-password (public — no JWT) ────────────────────────────────────────

// GET /api/users/reset-password/:token
exports.getResetPasswordPage = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
      select: { id: true, resetPasswordExpires: true },
    });

    if (!user || (user.resetPasswordExpires && user.resetPasswordExpires < new Date())) {
      return res.status(400).send(
        renderStatusPage({
          title: "Link Invalid",
          message: "This password reset link has already been used or has expired.",
          tone: "error",
        }),
      );
    }

    return res.send(renderResetPasswordPage(token));
  } catch (e) {
    console.error("getResetPasswordPage error:", e);
    return res.status(500).send(
      renderStatusPage({ title: "Error", message: `Server error: ${e?.message || "Unknown"}`, tone: "error" }),
    );
  }
};

// POST /api/users/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword) {
      return res.send(renderResetPasswordPage(token, { error: "Password is required." }));
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      return res.send(renderResetPasswordPage(token, { error: "Passwords do not match." }));
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.send(
        renderResetPasswordPage(token, {
          error: "Password must be at least 8 characters and include a letter, number, and special character.",
        }),
      );
    }

    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
      select: { id: true, resetPasswordExpires: true },
    });
    if (!user || (user.resetPasswordExpires && user.resetPasswordExpires < new Date())) {
      return res.status(400).send(
        renderStatusPage({
          title: "Link Invalid",
          message: "This password reset link has already been used or has expired.",
          tone: "error",
        }),
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 10),
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return res.send(
      renderStatusPage({
        title: "Password Updated",
        message: "Your password has been reset successfully. You can now log in to the PawCruz app.",
        tone: "success",
      }),
    );
  } catch (e) {
    console.error("resetPassword error:", e);
    return res.status(500).send(
      renderStatusPage({ title: "Error", message: `Server error: ${e?.message || "Unknown"}`, tone: "error" }),
    );
  }
};
