import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    // Redirect to login, but save the location they were trying to go to
    // so we can send them back there after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists, render the child routes (Dashboard, Monitor, etc.)
  return <Outlet />;
};
