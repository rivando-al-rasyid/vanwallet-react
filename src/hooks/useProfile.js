/**
 * useProfile.js
 *
 * Hook untuk profile management.
 * Reads from state.auth.user (persisted) and delegates to api.js functions.
 *
 * API endpoints used:
 *   GET  /profile/info      → loadProfile
 *   PATCH /profile/edit     → updateProfile
 *   PATCH /profile/password → changePassword
 *   PATCH /profile/change/pin → changePin
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserInfo,
  updateProfile as updateProfileApi,
  changePasswordApi,
  changePinApi,
  mapUserFromInfo,
} from "../utils/api";
import { mergeUser } from "../store/slices/authSlice";

export function useProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  /**
   * Fetches latest user info from GET /profile/info and merges into Redux
   */
  const loadProfile = useCallback(async () => {
    const info = await fetchUserInfo();
    const mapped = mapUserFromInfo(info, user?.token);
    dispatch(mergeUser(mapped));
    return mapped;
  }, [dispatch, user?.token]);

  /**
   * Updates profile fields via PATCH /profile/edit, then re-fetches
   */
  const updateProfileFields = useCallback(
    async ({ fullName, phone, photoFile }) => {
      await updateProfileApi({ fullName, phone, photoFile });
      const info = await fetchUserInfo();
      const mapped = mapUserFromInfo(info, user?.token);
      dispatch(mergeUser(mapped));
      return mapped;
    },
    [dispatch, user?.token],
  );

  /**
   * Changes login password via PATCH /profile/password
   */
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    await changePasswordApi(oldPassword, newPassword);
  }, []);

  /**
   * Changes PIN via PATCH /profile/change/pin
   */
  const changePin = useCallback(async (currentPin, newPin) => {
    await changePinApi(currentPin, newPin);
  }, []);

  return {
    user,
    loadProfile,
    updateProfile: updateProfileFields,
    changePassword,
    changePin,
    // Kept for backward compatibility with components that check these
    profileLoading: false,
    profileError: null,
  };
}
