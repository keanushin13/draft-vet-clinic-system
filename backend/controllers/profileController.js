const prisma = require("../lib/prisma");

// GET /api/users  (admin: all; staff: pet_owner only)
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = {};
    if (req.user.role === "staff") where.role = "pet_owner";
    else if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
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
    const { firstName, lastName, phone, address } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { firstName, lastName, phone, address },
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
      },
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/create  (admin/staff creates a new user)
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
const PUBLIC_SERVER_URL =
  process.env.PUBLIC_SERVER_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, firstName, lastName, phone } =
      req.body;
    if (!username || !email || !password || !role)
      return res
        .status(400)
        .json({ message: "username, email, password, role are required" });
    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email" });
    if (!PASSWORD_REGEX.test(password))
      return res.status(400).json({ message: "Weak password" });
    const allowedRoles = ["pet_owner", "veterinarian", "staff", "admin"];
    if (!allowedRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists)
      return res
        .status(400)
        .json({ message: "Email or username already exists" });

    const emailToken = crypto.randomBytes(32).toString("hex");
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: await bcrypt.hash(password, 10),
        role,
        firstName,
        lastName,
        phone,
        isVerified: false,
        emailVerificationToken: emailToken,
        emailVerificationExpires: new Date(Date.now() + 5 * 60 * 1000),
      },
      select: { id: true, username: true, email: true, role: true },
    });

    const verifyLink = `${PUBLIC_SERVER_URL}/api/users/verify-email/${emailToken}`;
    await sendEmail(
      email,
      "Verify Your PawCruz Account",
      `<h2>Email Verification</h2><p>Click to verify your account:</p><a href="${verifyLink}">Verify Email</a>`,
    );

    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/:id  (admin edits any user)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, address, role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, phone, address, role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
