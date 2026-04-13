import AuthContext from "./context";
import { useReducer } from "react";
import {
  saveSession,
  getSession,
  clearSession,
  loginUser,
  registerUser,
} from "../../utils/auth";

const initialState = {
  user: null,
  isLogin: false,
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload,
        isLogin: true,
        error: null,
      };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      clearSession();
      return {
        ...state,
        user: null,
        isLogin: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}

function AuthProvider({ children }) {
  const getInitialState = () => {
    const session = getSession();
    if (session.id) {
      return {
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          phone: session.phone,
          avatar: session.avatar || "https://via.placeholder.com/150",
        },
        isLogin: true,
        loading: false,
        error: null,
      };
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(authReducer, getInitialState());

  // Logout handler
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // Login handler
  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const user = await loginUser(credentials);
      saveSession(user);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
      throw err; // Re-throw to allow component to catch
    }
  };

  // Register handler
  const register = async (data) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const user = await registerUser(data);
      saveSession(user);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
      throw err; // Re-throw
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
