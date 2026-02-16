import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navigation from "./components/navigation/Navigation";
import JobSeekerPage from "./pages/SeekerPages/JobSeekerPage";
import AppliedJobsPage from "./pages/SeekerPages/AppliedJobsPage";
import SavedJobs from "./JobSeeker/SavedJobs";
import Changepassword from "./components/UI/ChangePassword";

export default function JobSeekerScreen() {
  return (
    <>
      <Navigation />

      <div style={{ width: "100%", marginTop: "100px" }}>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<JobSeekerPage />} />
          <Route path="/appliedJobs" element={<AppliedJobsPage />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/change-password" element={<Changepassword />} />

          {/* Catch unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}
