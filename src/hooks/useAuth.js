import { useState } from 'react';
import { UserServices } from './userServices';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const id = localStorage.getItem("user_id");
    return id ? {
      id,
      name: localStorage.getItem("user_name"),
      email: localStorage.getItem("user_email"),
    } : null;
  });

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const users = await UserServices.getAll();
      const match = users.find(u => u.email === email && u.password === password);

      if (!match) throw new Error("Invalid credentials");

      // Save to localStorage
      localStorage.setItem("user_id", match.id);
      localStorage.setItem("user_name", match.name);
      localStorage.setItem("user_email", match.email);

      setCurrentUser(match);
      return match;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  const updateProfile = async (payload) => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const updated = await UserServices.update(currentUser.id, payload);
      setCurrentUser(updated); // Sync state
      localStorage.setItem("user_name", updated.name);
      return updated;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    login,
    logout,
    updateProfile,
    isLoggedIn: !!currentUser,
    loading,
    error
  };
}