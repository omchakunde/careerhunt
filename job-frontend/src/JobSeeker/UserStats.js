import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Container } from "react-bootstrap";
import { FaBriefcase, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Config from "../config/Config.json";

/* =========================
   STAT CARD COMPONENT
========================= */
const StatCard = ({ title, value, icon, gradient }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div
      style={{
        background: gradient,
        color: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-5px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0px)")
      }
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h6 style={{ opacity: 0.9 }}>{title}</h6>
          <h2 style={{ marginTop: "10px", fontWeight: "bold" }}>
            {displayValue}
          </h2>
        </div>
        <div style={{ fontSize: "30px", opacity: 0.9 }}>{icon}</div>
      </div>
    </div>
  );
};

/* =========================
   MAIN USER STATS COMPONENT
========================= */
const UserStats = () => {
  const [stats, setStats] = useState({
    totalApplied: 0,
    shortlisted: 0,
    rejected: 0,
  });

  useEffect(() => {
    axios
      .get(`${Config.SERVER_URL}user/stats`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setStats({
          totalApplied: res.data.totalApplied || 0,
          shortlisted: res.data.shortlisted || 0,
          rejected: res.data.rejected || 0,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /* =========================
     CHART DATA
  ========================= */
  const chartData = [
    { name: "Applied", value: stats.totalApplied },
    { name: "Shortlisted", value: stats.shortlisted },
    { name: "Rejected", value: stats.rejected },
  ];

  const COLORS = ["#ffc107", "#28a745", "#dc3545"];

  return (
    <Container style={{ marginTop: "30px", marginBottom: "40px" }}>
      {/* STAT CARDS */}
      <Row className="g-4">
        <Col md={4}>
          <StatCard
            title="Total Applied"
            value={stats.totalApplied}
            icon={<FaBriefcase />}
            gradient="linear-gradient(135deg, #667eea, #764ba2)"
          />
        </Col>

        <Col md={4}>
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={<FaCheckCircle />}
            gradient="linear-gradient(135deg, #11998e, #38ef7d)"
          />
        </Col>

        <Col md={4}>
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<FaTimesCircle />}
            gradient="linear-gradient(135deg, #ff416c, #ff4b2b)"
          />
        </Col>
      </Row>

      {/* ANALYTICS CHART */}
      <Row style={{ marginTop: "50px" }}>
        <Col md={12}>
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            }}
          >
            <h5 style={{ marginBottom: "20px", fontWeight: "600" }}>
              Application Analytics
            </h5>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserStats;
