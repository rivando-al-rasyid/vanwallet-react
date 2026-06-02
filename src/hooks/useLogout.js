/**
 * useLogout.js
 *
 * Handles full logout:
 *   1. POST /auth/logout  (terminates server-side session token)
 *   2. clearToken()       (removes JWT from localStorage)
 *   3. dispatch(logout()) (clears Redux auth state)
 *   4. navigate('/login')
 */

import { useCallback } from "react";
import { useNavigate } from "react-router";
import { logoutApi } from "../utils/api";
import { useAuth } from "./useAuth";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useCallback(
    async (afterLogout) => {
      const shouldLogout = window.confirm("Are you sure you want to logout?");
      if (!shouldLogout) return;

      try {
        // POST /auth/logout — terminates server-side session
        await logoutApi();
      } catch {
        // API call may fail if token already expired; still clear local state
      } finally {
        // Always clear Redux + localStorage token
        logout();
      }

      if (typeof afterLogout === "function") afterLogout();
      navigate("/login");
    },
    [logout, navigate],
  );
}
