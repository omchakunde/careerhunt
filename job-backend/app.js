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

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

/* =======================
   MIDDLEWARES
======================= */

// Parse JSON bodies
app.use(express.json());

// ✅ CORS (FIXED FOR VERCEL + LOCALHOST)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://job-hunt-frontend-mu.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

/* =======================
   ROUTES
======================= */

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/provider", providerRoutes);
app.use("/user", userRoutes);

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Server Error";
  const data = error.data;

  res.status(status).json({
    message,
    data,
  });
});

/* =======================
   DATABASE & SERVER
======================= */
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
