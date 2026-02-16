import React, { useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ManageTab from "./ManageTab";
import ReactModal from "../../UI/ReactModal";
import AddJob from "./AddJob/AddJob";
import SpinnerComponent from "../../UI/SpinnerComponent";
import classes from "../../../pages/AdminPages/ManageUsersPage.module.css";
import Config from "../../../config/Config.json";

let jobId;

export default function ManageJobs() {
  const [showAddJobModal, setAddJobModal] = useState(false);
  const [action, setAction] = useState(false);
  const [showSpinner, setSpinner] = useState(false);
  const [showEditJobModal, setEditJobModal] = useState({
    show: false,
    inititalValues: {},
  });
  const [showDeleteModal, setDeleteModal] = useState(false);

  const token = localStorage.getItem("token");

  // 🔥 FIXED ADD JOB WITH IMAGE + CORRECT ROUTE
  const addJobHander = (values) => {
    setSpinner(true);

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);

    if (values.companyLogo) {
      formData.append("companyLogo", values.companyLogo);
    }

    axios
      .post(`${Config.SERVER_URL + "provider/add-job"}`, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setSpinner(false);
        setAction(!action);
        setAddJobModal(false);
        toast.success(res.data.message);
      })
      .catch(() => {
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };

  const editJobHandler = (jobData) => {
    setEditJobModal({ show: true, inititalValues: jobData });
  };

  // 🔥 FIXED EDIT WITH IMAGE SUPPORT + CORRECT ROUTE
  const editJobItemHandler = (values) => {
    const jobId = values._id;
    setSpinner(true);

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);

    if (values.companyLogo) {
      formData.append("companyLogo", values.companyLogo);
    }

    axios
      .put(`${Config.SERVER_URL + "provider/edit-job/" + jobId}`, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setEditJobModal((prev) => ({
          show: false,
          inititalValues: prev.inititalValues,
        }));
        setSpinner(false);
        setAction(!action);
        toast.success(res.data.message);
      })
      .catch(() => {
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };

  const deleteModalHandler = (jId) => {
    jobId = jId;
    setDeleteModal(true);
  };

  const deleteJobHandler = () => {
    setDeleteModal(false);
    setSpinner(true);

    axios
      .delete(`${Config.SERVER_URL + "provider/jobs/" + jobId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setAction(!action);
        setSpinner(false);
        toast.success(result.data.message);
      })
      .catch(() => {
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };

  return (
    <>
      {showSpinner && (
        <Container className={classes.overlaySpinner}>
          <SpinnerComponent />
        </Container>
      )}

      <ReactModal
        show={showAddJobModal}
        onHide={() => setAddJobModal(false)}
        formModal={true}
        buttonTitle="Add Job"
        formId="manageJob-form"
      >
        {{
          title: "Add new Job",
          body: <AddJob onAdd={addJobHander} />,
        }}
      </ReactModal>

      <ReactModal
        show={showEditJobModal.show}
        onHide={() =>
          setEditJobModal((prev) => ({
            show: false,
            inititalValues: prev.inititalValues,
          }))
        }
        formModal={true}
        buttonTitle="Edit Job"
        formId="manageJob-form"
      >
        {{
          title: "Edit the Job",
          body: (
            <AddJob
              jobInfo={showEditJobModal.inititalValues}
              onAdd={editJobItemHandler}
            />
          ),
        }}
      </ReactModal>

      <ReactModal
        show={showDeleteModal}
        isDelete={true}
        onOk={deleteJobHandler}
        onHide={() => setDeleteModal(false)}
      >
        {{ title: "Delete Job", body: <h1>Are you sure?</h1> }}
      </ReactModal>

      <ManageTab
        onShowAddUser={setAddJobModal}
        onEditJob={editJobHandler}
        onShowDelete={deleteModalHandler}
        changes={action}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
