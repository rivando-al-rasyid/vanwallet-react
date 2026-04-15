// src/hooks/useProfile.js
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, changePassword as changePasswordApi, changePinApi } from "../utils/auth";
import { mergeUser, setProfileError, setProfileLoading } from "../store/store";

export function useProfile() {
  const dispatch = useDispatch();
  const { user, profileStatus } = useSelector((state) => state.auth);

  const updateProfile = useCallback(async (payload) => {
    if (!user?.id) throw new Error("User not authenticated");
    dispatch(setProfileLoading(true));
    dispatch(setProfileError(null));
    try {
      const updated = await updateUser(user.id, payload);
      dispatch(mergeUser(updated));
      return updated;
    } catch (err) {
      dispatch(setProfileError(err.message));
      throw err;
    } finally {
      dispatch(setProfileLoading(false));
    }
  }, [dispatch, user?.id]);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    dispatch(setProfileLoading(true));
    dispatch(setProfileError(null));
    try {
      await changePasswordApi({ userId: user.id, oldPassword, newPassword });
    } catch (err) {
      dispatch(setProfileError(err.message));
      throw err;
    } finally {
      dispatch(setProfileLoading(false));
    }
  }, [dispatch, user?.id]);

  const changePin = useCallback(async (newPin) => {
    dispatch(setProfileLoading(true));
    dispatch(setProfileError(null));
    try {
      const updated = await changePinApi(user.id, newPin);
      dispatch(mergeUser(updated));
    } catch (err) {
      dispatch(setProfileError(err.message));
      throw err;
    } finally {
      dispatch(setProfileLoading(false));
    }
  }, [dispatch, user?.id]);

  return {
    user,
    updateProfile,
    changePassword,
    changePin,
    loading: profileStatus?.loading ?? false,
    error: profileStatus?.error ?? null,
  };
}