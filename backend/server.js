const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

/* =========================
   CORS
========================= */
const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");

const allowedOrigins = new Set(
  [
    "http://localhost:3000",
    "http://localhost:8081",
    "https://localhost",
    "http://localhost",
    "https://project-0pia5-lw940n1co-angelie-grace-s-projects.vercel.app",
    // Single URL (legacy)
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // The backend's own public URL — needed for server-rendered HTML form submissions
    process.env.PUBLIC_SERVER_URL,
    // Comma-separated list for production — set ALLOWED_ORIGINS on Render
    ...(process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : []),
  ].filter(Boolean).map(normalizeOrigin),
);

const isAllowedOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);
  if (allowedOrigins.has(normalizedOrigin)) return true;
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin);
};

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // allow requests with no origin or null origin (Postman, mobile apps, email link clicks)
    if (!origin || origin === "null") return callback(null, true);
    if (!isAllowedOrigin(origin)) {
      return callback(null, false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 204,
});

app.options("*", corsMiddleware);

app.use((req, res, next) => {
  // Skip CORS for same-origin browser navigations (e.g. server-rendered HTML form submissions).
  // Browsers set Sec-Fetch-Site: same-origin on these requests; they are not cross-origin.
  const fetchSite = req.headers["sec-fetch-site"];
  if (fetchSite === "same-origin" || fetchSite === "same-site") return next();
  return corsMiddleware(req, res, next);
});

/* =========================
   SECURITY HEADERS
========================= */
app.use(helmet());

/* =========================
   BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   COOKIES (required for CSRF)
========================= */
app.use(cookieParser());

/* =========================
   XSS PROTECTION
========================= */
app.use(xss());

/* =========================
   CSRF SETUP
========================= */
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  },
});

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("API is running");
});

// CSRF token fetcher
app.get("/api/users/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protected resource routes (JWT)
app.use("/api/users", require("./routes/profileRoutes"));

// Public routes (NO CSRF)
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/pets", require("./routes/petRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/vet-schedules", require("./routes/vetScheduleRoutes"));
app.use("/api/medical-records", require("./routes/medicalRecordRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/activity-logs", require("./routes/activityLogRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));
app.use("/api/clinic-settings", require("./routes/clinicSettingsRoutes"));
app.use("/api/holidays", require("./routes/holidayRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid or missing CSRF token" });
  }

  return next(err);
});

/* =========================
   SERVER
========================= */
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
