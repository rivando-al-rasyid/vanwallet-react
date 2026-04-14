import AuthContext from "./context";
import { useAuth } from "../../hooks/useAuth";

function AuthProvider({ children }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;