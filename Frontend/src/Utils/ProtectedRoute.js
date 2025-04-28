import { useProfileContext } from "../Context/fetchProfileContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { profile, loading } = useProfileContext();

  if (loading || !profile) {
    return <div className="p-4 text-center text-gray-600">Checking access...</div>; // or a spinner
  }

  return profile.role === "Admin" ? children : <Navigate to="/home" />;
};

export default ProtectedRoute;
