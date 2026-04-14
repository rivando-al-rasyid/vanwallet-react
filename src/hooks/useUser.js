import { useState, useCallback } from 'react';
import { UserServices } from './userServices';

export function useUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      return await UserServices.getAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id) => {
    setLoading(true);
    try {
      return await UserServices.getById(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchAllUsers, fetchUserById, loading, error };
}