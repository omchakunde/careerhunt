import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import Jobitem from "./Jobitem";
import Config from "../config/Config.json";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);

  const fetchSavedJobs = () => {
    axios
      .get(`${Config.SERVER_URL}user/saved`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setJobs(res.data.jobs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const removeSavedJob = (jobId) => {
    axios
      .delete(`${Config.SERVER_URL}user/saved/${jobId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        fetchSavedJobs();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container style={{ marginTop: "30px" }}>
      <h3 style={{ marginBottom: "20px" }}>⭐ Saved Jobs</h3>

      {jobs.length === 0 && <p>No saved jobs yet.</p>}

      {jobs.map((job) => (
        <div key={job._id} style={{ marginBottom: "20px" }}>
          <Jobitem item={job} jobApply={() => {}} />

          <button
            className="btn btn-danger mt-2"
            onClick={() => removeSavedJob(job._id)}
          >
            Remove
          </button>
        </div>
      ))}
    </Container>
  );
};

export default SavedJobs;
