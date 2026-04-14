import { useCallback, useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../context/auth/context";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  return useCallback(
    (afterLogout) => {
      logout();
      if (typeof afterLogout === "function") {
        afterLogout();
      }
      navigate("/login");
    },
    [logout, navigate],
  );
}
