const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   CORS
========================= */
const allowedOrigins = [
   "http://localhost:3000", // React Web Admin
   "http://localhost:8081"  // Expo Web
];

app.use(cors({
   origin: function (origin, callback) {
      // allow requests with no origin like Postman
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
         const msg = "The CORS policy for this site does not allow access from the specified Origin.";
         return callback(new Error(msg), false);
      }
      return callback(null, true);
   },
   credentials: true
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
   COOKIES (required for CSRF)
========================= */
app.use(cookieParser());

/* =========================
   XSS PROTECTION
========================= */
app.use(xss());

/* =========================
   NoSQL INJECTION PROTECTION
   (SAFE VERSION)
========================= */
app.use((req, res, next) => {
   mongoSanitize.sanitize(req.body);
   mongoSanitize.sanitize(req.params);
   next();
});

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

// Public routes (NO CSRF)
app.use("/api/users", require("./routes/userRoutes"));

// Example of protected routes later:
// app.use("/api/secure", csrfProtection, require("./routes/secureRoutes"));

/* =========================
   DATABASE + SERVER
========================= */
mongoose
   .connect(process.env.MONGO_URI)
   .then(() => {
      app.listen(process.env.PORT, () => {
         console.log(`Server running on port ${process.env.PORT}`);
      });
   })
   .catch((err) => console.error(err));