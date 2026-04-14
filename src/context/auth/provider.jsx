import AuthContext from "./context";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  updateUser,
} from "../../utils/auth";
import {
  clearAuth,
  mergeUser,
  setError,
  setLoading,
  setUser,
} from "../../store/store";

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    async (inputOrEmail, maybePassword) => {
      const email =
        typeof inputOrEmail === "object" ? inputOrEmail.email : inputOrEmail;
      const password =
        typeof inputOrEmail === "object"
          ? inputOrEmail.password
          : maybePassword;

      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const loggedInUser = await loginUser({ email, password });
        dispatch(setUser(loggedInUser));
        return loggedInUser;
      } catch (err) {
        dispatch(setError(err.message));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async ({ email, password }) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const payload = {
          email,
          password,
          name: email?.split("@")[0] || "User",
          phone: "",
        };
        const createdUser = await registerUser(payload);

        dispatch(setUser(createdUser));
        return createdUser;
      } catch (err) {
        dispatch(setError(err.message));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  const updateProfile = useCallback(
    async (payload) => {
      if (!user?.id) return null;

      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const updated = await updateUser(user.id, payload);
        dispatch(mergeUser(updated));
        return updated;
      } catch (err) {
        dispatch(setError(err.message));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, user],
  );

  const auth = useMemo(
    () => ({
      user,
      currentUser: user,
      login,
      register,
      logout,
      updateProfile,
      isLoggedIn: Boolean(user),
      loading,
      error,
    }),
    [error, loading, login, logout, register, updateProfile, user],
  );

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;