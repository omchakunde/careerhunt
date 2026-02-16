import React, { useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import classes from "./Modalf.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Config from "../config/Config.json";
import SpinnerComponent from "../components/UI/SpinnerComponent";

toast.configure();

function Register(props) {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [showSpinner, setSpinner] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "resume") {
      setInputs((prev) => ({
        ...prev,
        resume: files[0],
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    let isValid = true;
    let error = {};

    if (!inputs.name) {
      isValid = false;
      error.name = "Please enter your name.";
    }

    if (!inputs.email) {
      isValid = false;
      error.email = "Please enter your email.";
    }

    if (inputs.email) {
      const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!pattern.test(inputs.email)) {
        isValid = false;
        error.email = "Please enter valid email.";
      }
    }

    if (!inputs.resume) {
      isValid = false;
      error.resume = "Please upload your resume.";
    }

    setErrors(error);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("email", inputs.email);
    formData.append("resume", inputs.resume);
    formData.append("providerId", props.job.providerId);

    setSpinner(true);

    axios
      .post(
        `${Config.SERVER_URL}user/apply/${props.job._id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setSpinner(false);
        props.changes((prev) => !prev);
        toast.success(res.data.message);
        props.onClose();
      })
      .catch((err) => {
        setSpinner(false);
        toast.error("Application failed. Please try again.");
        console.log(err);
      });
  };

  return (
    <div>
      {showSpinner && <SpinnerComponent />}

      <div className={classes.abc}>
        <Row>
          <Col sm={4}></Col>
          <Col sm={4}>
            <Card
              className={classes.register}
              style={{
                backgroundColor: "white",
                border: "none",
                width: "20rem",
              }}
            >
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Applying For:</Form.Label>
                    <Form.Control
                      type="text"
                      value={props.job.title}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Name <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    {errors.name && (
                      <div className={classes.errors}>{errors.name}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Email <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <div className={classes.errors}>{errors.email}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Resume <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="resume"
                      onChange={handleChange}
                    />
                    {errors.resume && (
                      <div className={classes.errors}>{errors.resume}</div>
                    )}
                  </Form.Group>

                  <Button type="submit" className={classes.modalButtonstyle}>
                    Submit
                  </Button>

                  <Button
                    type="button"
                    className={classes.modalButtonStyle}
                    onClick={props.onClose}
                  >
                    Cancel
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Register;
