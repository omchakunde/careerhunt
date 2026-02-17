import AdminScreen from "../../AdminScreen";
import Login from "./Login";
import ProviderScreen from "../../ProviderScreen";
import JobSeekerScreen from "../../JobSeekerScreen";
import jwtDecode from "jwt-decode";

function Mdashboard() {
  const authToken = localStorage.getItem("token");

  if (authToken) {
    try {
      const decoded = jwtDecode(authToken);

      if (decoded.role === "Admin") {
        return <AdminScreen />;
      }

      if (decoded.role === "Job Provider") {
        return <ProviderScreen />;
      }

      if (decoded.role === "User") {
        return <JobSeekerScreen />;
      }
    } catch (error) {
      console.log("Invalid token");
    }
  }

  return <Login />;
}

export default Mdashboard;
