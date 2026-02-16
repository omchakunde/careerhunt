import React from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import classes from "./Layout.module.css";
import Navigation from "../navigation/Navigation";
import jwtDecode from "jwt-decode";

const Layout = (props) => {
  const authToken = localStorage.getItem("token");
  let role = null;

  if (authToken) {
    const decoded = jwtDecode(authToken);
    role = decoded.role;
  }

  return (
    <div>
      <Navigation />

      <div style={{ display: "flex", marginTop: "70px" }}>
        
        {/* ===== SIDEBAR (ONLY FOR PROVIDER) ===== */}
        {role === "Job Provider" && (
          <div
            style={{
              width: "220px",
              minHeight: "100vh",
              backgroundColor: "#1e293b",
              padding: "20px",
              color: "white",
            }}
          >
            <h5 style={{ marginBottom: "30px" }}>Provider Panel</h5>

            <NavLink
              to="/dashboard"
              style={{ display: "block", marginBottom: "15px", color: "white" }}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/manage-jobs"
              style={{ display: "block", marginBottom: "15px", color: "white" }}
            >
              Manage Jobs
            </NavLink>

            <NavLink
              to="/manage-applicants"
              style={{ display: "block", marginBottom: "15px", color: "white" }}
            >
              Applicants
            </NavLink>

            <NavLink
              to="/provider-report"
              style={{ display: "block", marginBottom: "15px", color: "white" }}
            >
              Reports
            </NavLink>
          </div>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <div style={{ flex: 1, padding: "30px" }}>
          <Container fluid>{props.children}</Container>
        </div>
      </div>
    </div>
  );
};

export default Layout;
