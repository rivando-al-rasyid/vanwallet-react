import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../store/slices/authSlice";
import { useToast } from "../context/toast/provider";
import { useConfirm } from "../context/confirm/provider";

/**
 * useLogout
 *
 * Unified logout handler. Call it directly — no wrapper needed.
 * Handles: confirm modal → dispatch logout → toast → navigate.
 *
 * Usage:
 *   const handleLogout = useLogout();
 *   <button onClick={handleLogout}>Keluar</button>
 */
export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  return useCallback(async () => {
    const ok = await confirm({
      title: "Keluar dari akun?",
      message: "Kamu akan keluar dari sesi ini.",
      confirmLabel: "Keluar",
      cancelLabel: "Batal",
      variant: "warning",
    });

    if (!ok) return;

    dispatch(logout());
    showToast("Kamu berhasil logout. Sampai jumpa!", "info");
    navigate("/login");
  }, [dispatch, navigate, showToast, confirm]);
}
