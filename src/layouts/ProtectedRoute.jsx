import { Navigate, Outlet } from "react-router";
import { isLoggedIn } from "../utils/auth";

/**
 * Protects dashboard routes — redirects to /login if the user is not authenticated.
 */
export function ProtectedRoute() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}

/**
 * Guest-only routes — redirects to /dashboard if the user is already logged in.
 * Prevents logged-in users from seeing login/register pages.
 */
export function GuestRoute() {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
