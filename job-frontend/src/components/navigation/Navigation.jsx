import React, { useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import classes from "./Navigation.module.css";
import { Navbar, Container, Nav, Dropdown, Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import Config from "../../config/Config.json";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authToken = localStorage.getItem("token");

  let redAuthToken = null;
  if (authToken) {
    try {
      redAuthToken = jwtDecode(authToken);
    } catch (err) {
      console.log("Invalid token");
    }
  }

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    dispatch({ type: "CLEARAUTHTOKEN" });
    navigate("/", { replace: true });
  };

  /* =========================
     FETCH NOTIFICATIONS
  ========================= */
  useEffect(() => {
    if (!authToken || !redAuthToken || redAuthToken.role !== "User") return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${Config.SERVER_URL}user/notifications`,
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        );

        const notes = res.data.notifications || [];
        setNotifications(notes);

        const unread = notes.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
  }, [authToken, redAuthToken]); // ✅ FIXED

  /* =========================
     MARK AS READ
  ========================= */
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${Config.SERVER_URL}user/notifications/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar
      fixed="top"
      variant="dark"
      expand="md"
      bg="primary"
      className={classes.nav}
    >
      <Container fluid>
        <NavLink className={classes.brand} to="/dashboard">
          Career Hunt
        </NavLink>

        <Navbar.Toggle />
        <Navbar.Collapse>

          {/* USER NAV */}
          {redAuthToken?.role === "User" && (
            <Nav className={`me-auto ${classes.pageLinks}`}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? classes.active : ""
                }
                to="/dashboard"
              >
                Apply
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive ? classes.active : ""
                }
                to="/appliedJobs"
              >
                Applied Jobs
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive ? classes.active : ""
                }
                to="/saved-jobs"
              >
                Saved Jobs
              </NavLink>
            </Nav>
          )}

          <Nav className="align-items-center">

            {/* NOTIFICATIONS */}
            {redAuthToken?.role === "User" && (
              <Dropdown align="end" className="me-3">
                <Dropdown.Toggle
                  variant="light"
                  style={{ position: "relative" }}
                >
                  <FaBell size={18} />

                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-8px",
                        fontSize: "10px",
                      }}
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "300px" }}>
                  {notifications.length === 0 && (
                    <Dropdown.Item disabled>
                      No notifications
                    </Dropdown.Item>
                  )}

                  {notifications.map((note) => (
                    <Dropdown.Item
                      key={note._id}
                      onClick={() => markAsRead(note._id)}
                      style={{
                        backgroundColor: note.isRead
                          ? "white"
                          : "#f0f8ff",
                        fontWeight: note.isRead
                          ? "normal"
                          : "bold",
                      }}
                    >
                      {note.message}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* PROFILE */}
            {redAuthToken && (
              <Dropdown align="end" className={classes.dropDown}>
                <Dropdown.Toggle className={classes.user}>
                  {redAuthToken.userName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Link
                    to="/change-password"
                    className={classes.changePassword}
                  >
                    Change Password
                  </Link>

                  <Dropdown.Divider />

                  <Dropdown.Item as="button" onClick={logoutHandler}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
