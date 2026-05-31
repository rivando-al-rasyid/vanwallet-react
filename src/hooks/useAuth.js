/**
 * useAuth.js
 *
 * Hook untuk login, register, dan logout.
 * Reads from state.auth (persisted slice).
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, mergeUser } from "../store/slices/authSlice";
import { register } from "../store/slices/registerSlice";
import { clearToken } from "../utils/api";

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  /**
   * Dispatches login thunk → POST /auth/login → GET /profile/info
   */
  const loginFn = useCallback(
    async (credentials) => {
      const result = await dispatch(login(credentials));
      if (login.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload || "Login failed");
    },
    [dispatch],
  );

  /**
   * Dispatches register thunk → POST /auth/register → auto-login
   */
  const registerFn = useCallback(
    async (data) => {
      const result = await dispatch(register(data));
      if (register.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload || "Registration failed");
    },
    [dispatch],
  );

  /**
   * Clears local token + Redux auth state (server logout handled in useLogout)
   */
  const logoutFn = useCallback(() => {
    clearToken();
    dispatch(logout());
  }, [dispatch]);

  /**
   * Merges partial user updates into auth.user
   * (e.g. after setPinApi or profile edit to update user.pin flag)
   */
  const mergeUserFn = useCallback(
    (partial) => dispatch(mergeUser(partial)),
    [dispatch],
  );

  return {
    user,
    isLoggedIn: !!user,
    loading,
    error,
    login: loginFn,
    register: registerFn,
    logout: logoutFn,
    mergeUser: mergeUserFn,
  };
}
