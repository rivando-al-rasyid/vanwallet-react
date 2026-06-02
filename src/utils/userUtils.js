/**
 * userUtils.js — Re-exported from api.js & auth.js for backward compatibility.
 *
 * Previously this file contained MockAPI / Tonic Fabricate calls.
 * Now all calls go through the real Gin backend endpoints.
 *
 * Kept as a thin re-export layer so slices that import from here don't break.
 */

export {
  updateProfile as updateUser,
  changePasswordApi as changePassword,
  changePinApi,
  verifyPinApi as verifyPin,
  fetchUserInfo,
  fetchProfile,
  mapUserFromInfo,
} from "./api";

export { loginUser, registerUser } from "./auth";
