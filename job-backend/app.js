require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const providerRoutes = require("./routes/provider");
const userRoutes = require("./routes/user");

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

/* ===========================
   MIDDLEWARE
=========================== */

// Parse JSON
app.use(bodyParser.json());

// ✅ Serve uploads folder (Production Safe)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ✅ CORS (Production Safe)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );
  next();
});

/* ===========================
   ROUTES
=========================== */

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/provider", providerRoutes);
app.use("/user", userRoutes);

/* ===========================
   GLOBAL ERROR HANDLER
=========================== */

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const data = error.data || null;

  res.status(status).json({
    message,
    data,
  });
});

/* ===========================
   DATABASE CONNECTION
=========================== */

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
