import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
const selectUser = (state) => state.profile.user;

/**
 * Guards routes that require authentication.
 * Redirects to /login and preserves the attempted URL via state.from.
 */
function ProtectedRoute() {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
