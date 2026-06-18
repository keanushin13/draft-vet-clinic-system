const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

/* =========================
   CORS
========================= */
app.use(cors({
  origin: [
    "https://pawcruz.com",
    "http://localhost:3000",
  ],
  credentials: true,
}));

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
   COOKIES
========================= */
app.use(cookieParser());

/* =========================
   XSS PROTECTION
========================= */
app.use(xss());

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/users/csrf-token", (req, res) => {
  res.json({ csrfToken: "disabled-dev-token" });
});

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/users", require("./routes/profileRoutes"));
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

/* =========================
   SERVER
========================= */
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
