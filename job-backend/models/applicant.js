const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const applicantSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    // ✅ Controlled Status (Professional Way)
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected"],
      default: "Applied",
    },

    // ✅ Track when status was updated
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },

    // ✅ Optional feedback from provider (future feature ready)
    notes: {
      type: String,
      default: "",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Applicant", applicantSchema);
