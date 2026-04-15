// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

/**
 * ProtectedRoute - Guards routes that require authentication.
 * If the user is not logged in, redirects to /login
 * and remembers the page they tried to visit (via `state.from`).
 */
function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
