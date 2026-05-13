const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const logActivity = require("../utils/logActivity");

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

// POST /api/users/create  (admin/staff creates a client)
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
        .json({ message: "username, email, password, role are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ message: "Weak password" });
    }

    if (req.user.role === "staff" && role !== "pet_owner") {
      return res
        .status(403)
        .json({ message: "Staff can only create pet owner clients" });
    }

    const allowedRoles = ["pet_owner", "veterinarian", "staff", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (phone && !PHONE_REGEX.test(String(phone))) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 11 digits" });
    }

    const duplicateChecks = [{ email }, { username }];
    if (phone) duplicateChecks.push({ phone });

    const exists = await prisma.user.findFirst({
      where: { OR: duplicateChecks },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Email, username, or phone already exists" });
    }

    const fn = firstName?.trim() || null;
    const ln = lastName?.trim() || null;
    const addr = address?.trim() || null;

    const isPetOwner = role === "pet_owner";
    const profileCompleted = isPetOwner ? Boolean(fn && ln && addr) : false;

    const created = await prisma.user.create({
      data: {
        username,
        email,
        password: await bcrypt.hash(password, 10),
        role,
        firstName: fn,
        lastName: ln,
        phone: phone || null,
        address: addr,
        isVerified: true,
        isActive: true,
        profileCompleted,
      },
      select: { id: true, username: true },
    });

    await logActivity({
      action: `Created ${role} account: ${username}`,
      target: created.id,
      staffId: req.user.id,
    });

    const createdWithMeta = await prisma.user.findUnique({
      where: { id: created.id },
      select: userSelect,
    });

    res.status(201).json(createdWithMeta);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Server error", error: e?.message || "Unknown error" });
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
