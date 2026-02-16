import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Navbar,
  NavDropdown,
  Container,
  Nav,
  Dropdown
} from "react-bootstrap";
import classes from "./Navbar.module.css";
import jwtDecode from "jwt-decode";

const Navbar1 = () => {
  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  return (
    <Navbar variant="dark" expand="md" className={classes.nav}>
      <Container fluid>
        <Link style={{ textDecoration: "none" }} to="/">
          <Navbar.Brand className={classes.brand}>
            Job Hunt
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className={`me-auto ${classes.pageLinks}`}>

            {/* ===== ADMIN LINKS ===== */}
            {role === "Admin" && (
              <>
                <NavLink className={classes.link} to="/user">
                  Users
                </NavLink>

                <NavLink className={classes.link} to="/manageJobs">
                  Jobs
                </NavLink>

                <NavLink className={classes.link} to="/Report">
                  Reports
                </NavLink>
              </>
            )}

            {/* ===== JOB SEEKER LINKS ===== */}
            {role === "User" && (
              <>
                <NavLink className={classes.link} to="/dashboard">
                  Dashboard
                </NavLink>

                <NavLink className={classes.link} to="/appliedJobs">
                  Applied Jobs
                </NavLink>

                <NavLink className={classes.link} to="/saved-jobs">
                  Saved Jobs
                </NavLink>
              </>
            )}

          </Nav>

          {token && (
            <Nav>
              <NavDropdown
                title="Profile"
                align="end"
                className={classes.user}
              >
                <NavDropdown.Item>
                  Change Password
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <Dropdown.Item
                  as="button"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Dropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbar1;
