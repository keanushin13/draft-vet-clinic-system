const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   CORS
========================= */
const allowedOrigins = new Set(
  [
    "http://localhost:3000", // React Web Admin
    "http://localhost:8081", // Expo Web
    "https://localhost", // Capacitor Mobile App
    "http://localhost", // Capacitor Mobile App (HTTP fallback)
    process.env.CLIENT_URL, // LAN web frontend used by email links
  ].filter(Boolean),
);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like Postman
      if (!origin) return callback(null, true);
      if (!allowedOrigins.has(origin)) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

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
    sameSite: "strict",
  },
});

/* =========================
   ROUTES
========================= */

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

/* =========================
   SERVER
========================= */
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
