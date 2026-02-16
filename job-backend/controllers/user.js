const Job = require("../models/job");
const Applicant = require("../models/applicant");
const SavedJob = require("../models/savedJob");
const Notification = require("../models/notification");   // ⭐ NEW
const { clearResume } = require("../util/helper");


/* =========================
   GET AVAILABLE JOBS
========================= */
exports.getAvailableJobs = async (req, res, next) => {
  try {
    const applicants = await Applicant.find({ userId: req.userId }).lean();
    const appliedJobs = applicants.map(app => app.jobId);

    const jobs = await Job.find({
      _id: { $nin: appliedJobs }
    }).lean();

    res.status(200).json({
      message: "Fetched the list of jobs",
      jobs
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


/* =========================
   GET APPLIED JOBS
========================= */
exports.getAppliedJobs = async (req, res, next) => {
  try {
    const applicants = await Applicant.find({ userId: req.userId }).lean();
    const appliedJobs = applicants.map(app => app.jobId);

    const statusMap = new Map();
    applicants.forEach(app => {
      statusMap.set(app.jobId.toString(), app.status);
    });

    const jobsApplied = await Job.find({
      _id: { $in: appliedJobs }
    }).lean();

    jobsApplied.forEach(job => {
      job.status = statusMap.get(job._id.toString());
    });

    res.status(200).json({
      message: "Fetched the list of jobs",
      jobsApplied
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


/* =========================
   APPLY FOR JOB
========================= */
exports.applyJob = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error("Resume not Found");
      err.statusCode = 422;
      throw err;
    }

    const jobId = req.params.jobId;
    const userId = req.userId;
    const providerId = req.body.providerId;
    const resume = req.file.path.replace(/\\/g, "/");

    const existing = await Applicant.findOne({ jobId, userId });

    if (existing) {
      clearResume(resume);
      return res.status(409).json({
        message: "You have already applied for the job!"
      });
    }

    const newApplicant = new Applicant({
      jobId,
      userId,
      resume,
      status: "Applied",
      appliedDate: new Date(),
      providerId
    });

    await newApplicant.save();

    // ⭐ CREATE NOTIFICATION AFTER APPLY
    await Notification.create({
      userId,
      message: "You successfully applied for a job.",
      isRead: false
    });

    res.status(201).json({
      message: "Successfully applied for the job!"
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


/* =========================
   USER DASHBOARD STATS
========================= */
exports.getUserStats = async (req, res, next) => {
  try {
    const totalApplied = await Applicant.countDocuments({
      userId: req.userId
    });

    const shortlisted = await Applicant.countDocuments({
      userId: req.userId,
      status: "Shortlisted"
    });

    const rejected = await Applicant.countDocuments({
      userId: req.userId,
      status: "Rejected"
    });

    res.status(200).json({
      totalApplied,
      shortlisted,
      rejected
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


/* =========================
   SAVE JOB
========================= */
exports.saveJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.userId;

    const exists = await SavedJob.findOne({ jobId, userId });

    if (exists) {
      return res.status(409).json({
        message: "Job already saved"
      });
    }

    const saved = new SavedJob({
      jobId,
      userId
    });

    await saved.save();

    // ⭐ CREATE NOTIFICATION
    await Notification.create({
      userId,
      message: "Job saved to your profile.",
      isRead: false
    });

    res.status(201).json({
      message: "Job saved successfully"
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


/* =========================
   GET SAVED JOBS
========================= */
exports.getSavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({
      userId: req.userId
    }).lean();

    const jobIds = saved.map(item => item.jobId);

    const jobs = await Job.find({
      _id: { $in: jobIds }
    }).lean();

    res.status(200).json({
      jobs
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


/* =========================
   REMOVE SAVED JOB
========================= */
exports.removeSavedJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    await SavedJob.deleteOne({
      jobId,
      userId: req.userId
    });

    res.status(200).json({
      message: "Saved job removed"
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


/* =========================
   NOTIFICATIONS
========================= */

// Get notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      notifications
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

// Mark notification as read
exports.markNotificationRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.status(200).json({
      message: "Notification marked as read"
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
