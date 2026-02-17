import { useState, useEffect } from "react";
import AdminScreen from "../../AdminScreen";
import Login from "./Login";
import ProviderScreen from "../../ProviderScreen";
import JobSeekerScreen from "../../JobSeekerScreen";
import jwtDecode from "jwt-decode";

function Mdashboard() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 👇 This makes component re-check token after login
  useEffect(() => {
    const interval = setInterval(() => {
      setToken(localStorage.getItem("token"));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (token) {
    try {
      const decoded = jwtDecode(token);

      if (decoded.role === "Admin") return <AdminScreen />;
      if (decoded.role === "Job Provider") return <ProviderScreen />;
      if (decoded.role === "User") return <JobSeekerScreen />;
    } catch (error) {
      console.log("Invalid token");
    }
  }

  return <Login />;
}

export default Mdashboard;
