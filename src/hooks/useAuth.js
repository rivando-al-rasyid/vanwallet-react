// src/hooks/useAuth.js
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../utils/auth";
import { clearAuth, setAuthError, setAuthLoading, setUser } from "../store/store";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, authStatus } = useSelector((state) => state.auth);

  const login = useCallback(async (credentials) => {
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));
    try {
      const loggedInUser = await loginUser(credentials);
      dispatch(setUser(loggedInUser));
      return loggedInUser;
    } catch (err) {
      dispatch(setAuthError(err.message));
      throw err;
    } finally {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  const register = useCallback(async (data) => {
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));
    try {
      const created = await registerUser({
        ...data,
        name: data.email?.split("@")[0] || "User",
      });
      dispatch(setUser(created));
      return created;
    } catch (err) {
      dispatch(setAuthError(err.message));
      throw err;
    } finally {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    user,
    isLoggedIn: !!user,
    loading: authStatus?.loading ?? false,
    error: authStatus?.error ?? null,
    login,
    register,
    logout,
  };
}