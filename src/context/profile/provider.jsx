import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, changePassword as changePasswordApi, changePinApi } from "../../utils/auth";
import { mergeUser, setProfileError, setProfileLoading } from "../../store/store";
import ProfileContext from "./context";

export function ProfileProvider({ children }) {
  const dispatch = useDispatch();
  const { user, profileStatus } = useSelector((state) => state.auth);
  const loading = profileStatus?.loading ?? false;
  const error = profileStatus?.error ?? null;

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

  const value = useMemo(() => ({
    updateProfile,
    changePassword,
    changePin,
    profileLoading: loading,
    profileError: error,
  }), [updateProfile, changePassword, changePin, loading, error]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;
