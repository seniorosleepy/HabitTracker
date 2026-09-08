import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed }) => {
  if (isAllowed) {
    return <Navigate to="/main" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
