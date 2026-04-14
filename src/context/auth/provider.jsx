import AuthContext from "./context";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../utils/auth";
import { clearAuth, setAuthError, setAuthLoading, setUser } from "../../store/store";

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, authStatus } = useSelector((state) => state.auth);
  const loading = authStatus?.loading ?? false;
  const error = authStatus?.error ?? null;

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
      const createdUser = await registerUser({
        ...data,
        name: data.email?.split("@")[0] || "User",
      });
      dispatch(setUser(createdUser));
      return createdUser;
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

  const value = useMemo(() => ({
    user,
    isLoggedIn: !!user,
    loading,
    error,
    login,
    register,
    logout,
  }), [user, loading, error, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
