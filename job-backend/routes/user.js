const express = require("express");

const userController = require("../controllers/user");

const isAuthenticated = require("../middleware/is-authenticated");
const { isAuthorized, isUser } = require("../middleware/is-authorized");
const upload = require("../middleware/upload");   // ⭐ ADD THIS

const router = express.Router();

/* =========================
   JOB ROUTES
========================= */

router.get(
  "/jobsAvailable",
  isAuthenticated,
  isAuthorized,
  isUser,
  userController.getAvailableJobs
);

router.get(
  "/jobsApplied",
  isAuthenticated,
  isAuthorized,
  isUser,
  userController.getAppliedJobs
);

router.post(
  "/apply/:jobId",
  isAuthenticated,
  isAuthorized,
  isUser,
  upload.single("resume"),   // ⭐ VERY IMPORTANT
  userController.applyJob
);


/* =========================
   USER DASHBOARD STATS
========================= */

router.get(
  "/stats",
  isAuthenticated,
  isAuthorized,
  isUser,
  userController.getUserStats
);


/* =========================
   SAVE JOB FEATURE
========================= */

// Save a job
router.post(
  "/save/:jobId",
  isAuthenticated,
  isAuthorized,
  isUser,
  userController.saveJob
);

// Get all saved jobs
router.get(
  "/saved",
  isAuthenticated,
  isAuthorized,
  isUser,
  userController.getSavedJobs
);

// Remove saved job
router.delete(
  "/saved/:jobId",
  isAuthenticated,
  isAuthorized,
  isUser,
  userController.removeSavedJob
);

router.get(
  "/notifications",
  isAuthenticated,
  isAuthorized,
  isUser,
  userController.getNotifications
);

router.put(
  "/notifications/:id",
  isAuthenticated,
  isAuthorized,
  isUser,
  userController.markNotificationRead
);

module.exports = router;
