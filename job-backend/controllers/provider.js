const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Job = require("../models/job");
const Applicant = require("../models/applicant");
const User = require("../models/user");
const Notification = require("../models/notification");

const { clearResume } = require("../util/helper");

/* ================= GET STATS ================= */
exports.getStats = async (req, res, next) => {
  try {
    const jobsCount = await Job.countDocuments({
      providerId: req.userId,
    });

    const applicantsCount = await Applicant.countDocuments({
      providerId: req.userId,
    });

    res.status(200).json({
      message: "Successfully fetched the stats",
      stats: { jobsCount, applicantsCount },
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET RECENT JOBS ================= */
exports.getRecents = async (req, res, next) => {
  try {
    const jobs = await Job.find({ providerId: req.userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    res.status(200).json({
      message: "Successfully fetched recent jobs",
      recentJobs: jobs,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET JOBS ================= */
exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      providerId: req.userId,
    }).lean();

    res.status(200).json({
      message: "Fetched jobs successfully",
      jobs,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= ADD JOB ================= */
exports.addJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const newJob = new Job({
      ...req.body,
      providerId: req.userId,
      companyLogo: req.file ? req.file.filename : null,
    });

    const job = await newJob.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { jobsPosted: job._id },
    });

    res.status(201).json({
      message: "Job added successfully",
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET SINGLE JOB ================= */
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      providerId: req.userId,
    }).lean();

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job fetched successfully",
      job,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= EDIT JOB ================= */
exports.editJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      updatedData.companyLogo = req.file.filename;
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.jobId, providerId: req.userId },
      updatedData,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

/* ================= DELETE JOB ================= */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.jobId,
      providerId: req.userId,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { jobsPosted: req.params.jobId },
    });

    const applicants = await Applicant.find({
      jobId: req.params.jobId,
    });

    applicants.forEach((app) => {
      clearResume(app.resume);
    });

    await Applicant.deleteMany({
      jobId: req.params.jobId,
    });

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET APPLICANTS ================= */
exports.getApplicantsForJob = async (req, res, next) => {
  try {
    const applicants = await Applicant.find({
      providerId: req.userId,
      jobId: req.params.jobId,
      status: "Applied",
    })
      .populate("userId", "name email")
      .lean();

    res.status(200).json({
      applicants,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= GET SHORTLISTED ================= */
exports.getShortlistsForJob = async (req, res, next) => {
  try {
    const shortlists = await Applicant.find({
      providerId: req.userId,
      jobId: req.params.jobId,
      status: "Shortlisted",
    })
      .populate("userId", "name email")
      .lean();

    res.status(200).json({
      shortlists,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= VIEW RESUME ================= */
exports.getApplicantResume = async (req, res, next) => {
  try {
    const applicant = await Applicant.findOne({
      _id: req.params.applicantItemId,
      providerId: req.userId,
    });

    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    const resumePath = path.join(applicant.resume);

    res.setHeader("Content-Type", "application/pdf");
    fs.createReadStream(resumePath).pipe(res);
  } catch (err) {
    next(err);
  }
};

/* ================= SHORTLIST ================= */
exports.shortlistApplicant = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(
      req.params.applicantItemId
    );

    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    if (applicant.providerId.toString() !== req.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    applicant.status = "Shortlisted";
    await applicant.save();

    await Notification.create({
      userId: applicant.userId,
      message: "🎉 You have been shortlisted!",
    });

    res.status(200).json({
      message: "Applicant shortlisted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/* ================= REJECT ================= */
exports.rejectApplicant = async (req, res, next) => {
  try {
    const applicant = await Applicant.findById(
      req.params.applicantItemId
    );

    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    if (applicant.providerId.toString() !== req.userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    applicant.status = "Rejected";
    await applicant.save();

    await Notification.create({
      userId: applicant.userId,
      message: "❌ Your application has been rejected.",
    });

    res.status(200).json({
      message: "Applicant rejected successfully",
    });
  } catch (err) {
    next(err);
  }
};
