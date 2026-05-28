// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { getToken } from "../utils/api";

function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  // 1. Not logged in (no Redux state)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Token missing from localStorage (e.g. cleared externally)
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Logged in but PIN not set → redirect to PIN setup
  if (!user.pin) {
    return <Navigate to="/login/pin" replace />;
  }

  // 4. All checks passed → render child routes
  return <Outlet />;
}

export default ProtectedRoute;
