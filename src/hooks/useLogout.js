import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../store/slices/authSlice";

/**
 * Returns a logout handler that:
 * 1. Asks for confirmation
 * 2. Dispatches logout (clears both auth + profile state via cross-slice effects)
 * 3. Calls an optional afterLogout callback
 * 4. Redirects to /login
 */
export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useCallback(
    (afterLogout) => {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (!confirmed) return;

      dispatch(logout());

      if (typeof afterLogout === "function") afterLogout();

      navigate("/login");
    },
    [dispatch, navigate]
  );
}
