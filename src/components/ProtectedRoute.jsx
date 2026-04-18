import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
/**
 * Guards routes that require authentication.
 * Redirects to /login and preserves the attempted URL via state.from.
 */
function ProtectedRoute() {
  const user = useSelector((state) => state.profile.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const isPinSetupComplete = user.pin?.toString().length === 6;

  if (!isPinSetupComplete) {
    return <Navigate to="/register/pin" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
