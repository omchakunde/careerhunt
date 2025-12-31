import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Form, Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import classes from "./Register.module.css";
import Config from "../../config/Config.json";

const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({
    show: false,
    message: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = Config.TITLE.LOGIN;
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    setBackendErrors({ show: false, message: "" });

    axios
      .post(`${Config.SERVER_URL}/auth/login`, inputs)
      .then((res) => {
        const token = res.data.token;

        // ✅ store token
        localStorage.setItem("token", token);

        // ✅ redux
        dispatch({
          type: "SETAUTHTOKEN",
          data: token,
        });

        // ✅ redirect
        navigate("/dashboard");
      })
      .catch((err) => {
        const status = err.response?.status;

        if (status === 401 || status === 422) {
          setBackendErrors({
            show: true,
            message: "Incorrect Email or Password",
          });
        } else {
          setBackendErrors({
            show: true,
            message: "Server error. Please try again later.",
          });
        }
      });
  };

  const validate = () => {
    let isValid = true;
    let error = {};

    if (!inputs.email) {
      isValid = false;
      error.email = "Please enter your email address.";
    }

    if (
      inputs.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)
    ) {
      isValid = false;
      error.email = "Please enter a valid email address.";
    }

    if (!inputs.password) {
      isValid = false;
      error.password = "Please enter your password.";
    }

    if (inputs.password && inputs.password.length < 6) {
      isValid = false;
      error.password = "Password must be at least 6 characters.";
    }

    setErrors(error);
    return isValid;
  };

  return (
    <React.Fragment>
      <Header />

      <Container className="mb-5">
        <h1 className="p-3 text-center" style={{ color: "#2c49ed" }}>
          Login to your Job Portal
        </h1>

        <Row className="mb-5">
          <Col
            lg={5}
            md={6}
            sm={12}
            className={`${classes.formContainer} p-5 m-auto shadow-sm rounded-lg`}
          >
            {backendErrors.show && (
              <div className="login-error">{backendErrors.message}</div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.email}</p>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Password <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                />
                <p style={{ color: "red" }}>{errors.password}</p>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button type="submit" variant="primary" size="lg">
                  Log In
                </Button>
              </div>

              <Row className="mt-4">
                <Col>
                  <Link to="/Register">
                    <Button variant="success">Sign Up</Button>
                  </Link>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Login;
