import { useCallback, useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../context/auth/context";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  return useCallback(
    (afterLogout) => {
      const shouldLogout = window.confirm("Are you sure you want to logout?");
      if (!shouldLogout) return;

      logout();
      if (typeof afterLogout === "function") {
        afterLogout();
      }
      navigate("/login");
    },
    [logout, navigate],
  );
}
