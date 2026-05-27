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
        await logoutApi();
      } catch {
        logout();
      }

      if (typeof afterLogout === "function") afterLogout();
      navigate("/login");
    },
    [logout, navigate],
  );
}
