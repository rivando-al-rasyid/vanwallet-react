import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../store/slices/authSlice";
import { useToast } from "../context/toast/provider";
import { useConfirm } from "../context/confirm/provider";

/**
 * Returns a logout handler that:
 * 1. Shows a confirm modal (non-blocking, Promise-based)
 * 2. Dispatches logout on confirm
 * 3. Shows a toast notification
 * 4. Calls an optional afterLogout callback
 * 5. Redirects to /login
 */
export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  return useCallback(
    async (afterLogout) => {
      const ok = await confirm({
        title: "Keluar dari akun?",
        message: "Kamu akan keluar dari sesi ini. Pastikan kamu sudah menyimpan semua perubahan.",
        confirmLabel: "Keluar",
        cancelLabel: "Batal",
        variant: "warning",
      });

      if (!ok) return;

      dispatch(logout());
      showToast("Kamu berhasil logout. Sampai jumpa!", "info");

      if (typeof afterLogout === "function") afterLogout();

      navigate("/login");
    },
    [dispatch, navigate, showToast, confirm]
  );
}
