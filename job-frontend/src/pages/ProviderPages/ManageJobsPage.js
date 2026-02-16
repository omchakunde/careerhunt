import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SpinnerComponent from "../../components/UI/SpinnerComponent";
import ManageTab from "../../Job Provider/Components/ManageJobs/ManageTab";
import ReactModal from "../../Job Provider/Components/ManageJobs/ReactModal";
import AddJob from "../../Job Provider/Components/AddJob/AddJob";
import Config from "../../config/Config.json";

let jobId;

export default function ManageJobsPage() {
  const [action, setAction] = useState(false);
  const [showSpinner, setSpinner] = useState(false);

  const [showAddJobModal, setAddJobModal] = useState(false);
  const [showEditJobModal, setEditJobModal] = useState({
    show: false,
    inititalValues: {},
  });
  const [showDeleteModal, setDeleteModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = Config.TITLE.MANAGE_JOBS;
  }, []);

  const editJobHandler = (jobData) => {
    setEditJobModal({ show: true, inititalValues: jobData });
  };

  const deleteModalHandler = (jId) => {
    jobId = jId;
    setDeleteModal(true);
  };

  const deleteItemHandler = () => {
    setDeleteModal(false);
    setSpinner(true);

    axios
      .delete(`${Config.SERVER_URL + "provider/jobs/" + jobId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setSpinner(false);
        setAction(!action);
        toast.success(result.data.message);
      })
      .catch(() => {
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };

  // ✅ UPDATED ADD JOB WITH IMAGE SUPPORT
  const addJobHandler = (values) => {
    setSpinner(true);

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);
    formData.append("category", values.category);

    // 🔥 image field
    if (values.companyLogo) {
      formData.append("companyLogo", values.companyLogo);
    }

    axios
      .post(
        `${Config.SERVER_URL + "provider/add-job"}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((result) => {
        setAction(!action);
        setSpinner(false);
        setAddJobModal(false);
        toast.success(result.data.message);
      })
      .catch(() => {
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };

  // Optional: Update edit job to support image also
  const editJobItemHandler = (values) => {
    const j_id = values._id;
    setSpinner(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);
    formData.append("category", values.category);

    if (values.companyLogo) {
      formData.append("companyLogo", values.companyLogo);
    }

    axios
      .put(
        `${Config.SERVER_URL + "provider/edit-job/" + j_id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((result) => {
        setAction(!action);
        setSpinner(false);
        setEditJobModal((prev) => ({
          show: false,
          inititalValues: prev.inititalValues,
        }));
        toast.success(result.data.message);
      })
      .catch(() => {
        setSpinner(false);
        toast.error("Oops something went wrong");
      });
  };

  return (
    <>
      <Suspense fallback={<SpinnerComponent />}>
        {showSpinner && <SpinnerComponent />}

        {/* ADD JOB MODAL */}
        <ReactModal
          show={showAddJobModal}
          onHide={() => setAddJobModal(false)}
        >
          {{
            title: "Add new Job",
            body: <AddJob onAdd={addJobHandler} />,
          }}
        </ReactModal>

        {/* EDIT JOB MODAL */}
        <ReactModal
          show={showEditJobModal.show}
          onHide={() =>
            setEditJobModal((prev) => ({
              show: false,
              inititalValues: prev.inititalValues,
            }))
          }
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
      </Suspense>

      {/* DELETE MODAL */}
      <ReactModal
        show={showDeleteModal}
        isDelete={true}
        onOk={deleteItemHandler}
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
