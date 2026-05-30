import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePasswordApi,
  changePinApi,
  fetchUserInfo,
  mapUserFromInfo,
  updateProfile,
} from "../utils/api";
import { mergeUser, setProfileError, setProfileLoading } from "../store/store";

export function useProfile() {
  const dispatch = useDispatch();
  const { user, profileStatus } = useSelector((state) => state.auth);

  const loadProfile = useCallback(async () => {
    dispatch(setProfileLoading(true));
    dispatch(setProfileError(null));
    try {
      const info = await fetchUserInfo();
      const mapped = mapUserFromInfo(info, user?.token);
      dispatch(mergeUser(mapped));
      return mapped;
    } catch (err) {
      dispatch(setProfileError(err.message));
      throw err;
    } finally {
      dispatch(setProfileLoading(false));
    }
  }, [dispatch, user?.token]);

  const updateProfileFields = useCallback(
    async ({ fullName, phone, photoFile }) => {
      dispatch(setProfileLoading(true));
      dispatch(setProfileError(null));
      try {
        await updateProfile({ fullName, phone, photoFile });
        const info = await fetchUserInfo();
        const mapped = mapUserFromInfo(info, user?.token);
        dispatch(mergeUser(mapped));
        return mapped;
      } catch (err) {
        dispatch(setProfileError(err.message));
        throw err;
      } finally {
        dispatch(setProfileLoading(false));
      }
    },
    [dispatch, user?.token],
  );

  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
      dispatch(setProfileLoading(true));
      dispatch(setProfileError(null));
      try {
        await changePasswordApi(oldPassword, newPassword);
      } catch (err) {
        dispatch(setProfileError(err.message));
        throw err;
      } finally {
        dispatch(setProfileLoading(false));
      }
    },
    [dispatch],
  );

  const changePin = useCallback(
    async (currentPin, newPin) => {
      dispatch(setProfileLoading(true));
      dispatch(setProfileError(null));
      try {
        await changePinApi(currentPin, newPin);
      } catch (err) {
        dispatch(setProfileError(err.message));
        throw err;
      } finally {
        dispatch(setProfileLoading(false));
      }
    },
    [dispatch],
  );

  return {
    user,
    loadProfile,
    updateProfile: updateProfileFields,
    changePassword,
    changePin,
    loading: profileStatus?.loading ?? false,
    profileLoading: profileStatus?.loading ?? false,
    error: profileStatus?.error ?? null,
    profileError: profileStatus?.error ?? null,
  };
}
