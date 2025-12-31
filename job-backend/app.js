require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

/* =======================
   ROUTE IMPORTS
======================= */
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const providerRoutes = require("./routes/provider");
const userRoutes = require("./routes/user");

/* =======================
   APP INIT
======================= */
const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   MIDDLEWARES (ORDER MATTERS)
======================= */

// ✅ JSON parser
app.use(express.json());

// ✅ CORS — ALLOW VERCEL + LOCALHOST
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://job-hunt-frontend-mu.vercel.app",
      ];

      // allow server-to-server / Postman / Render health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// ✅ MUST be here for preflight
app.options("*", cors());

/* =======================
   HEALTH CHECK (IMPORTANT)
======================= */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* =======================
   ROUTES
======================= */
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/provider", providerRoutes);
app.use("/user", userRoutes);

/* =======================
   ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    data: err.data || null,
  });
});

/* =======================
   DATABASE & SERVER
======================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Backend running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });
