import AuthContext from "./context";
import { useEffect, useState } from "react";
import {
  saveSession,
  getSession,
  clearSession,
  isLoggedIn,
} from "../../utils/auth";

function AuthProvider({ children }) {
  // Initialize from session storage
  const [user, setUser] = useState(() => {
    const session = getSession();
    if (session.id) {
      return {
        id: session.id,
        name: session.name,
        email: session.email,
        phone: session.phone,
        avatar: session.avatar || "https://via.placeholder.com/150",
      };
    }
    return null;
  });

  const [isLogin, setIsLogin] = useState(() => isLoggedIn());

  // Sync context with session storage
  useEffect(() => {
    if (user && user.id) {
      saveSession(user);
      setIsLogin(true);
    } else {
      clearSession();
      setIsLogin(false);
    }
  }, [user]);

  // Logout handler that clears both context and session
  const logout = () => {
    clearSession();
    setUser(null);
    setIsLogin(false);
  };

  // Login handler that sets both context and session
  const login = (userData) => {
    setUser(userData);
    setIsLogin(true);
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
