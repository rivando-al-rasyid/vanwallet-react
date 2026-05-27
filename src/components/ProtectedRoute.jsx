// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

/**
 * ProtectedRoute - Guards routes that require authentication.
 * If the user is not logged in, redirects to /login.
 * If the user has no PIN set, redirects to /login/pin.
 */
function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.pin) {
    return <Navigate to="/login/pin" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
