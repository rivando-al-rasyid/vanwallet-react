// src/hooks/useLogout.js
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useCallback((afterLogout) => {
    const shouldLogout = window.confirm("Are you sure you want to logout?");
    if (!shouldLogout) return;
    logout();
    if (typeof afterLogout === "function") afterLogout();
    navigate("/login");
  }, [logout, navigate]);
}