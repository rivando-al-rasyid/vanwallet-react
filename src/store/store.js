/**
 * store.js — Redux store for VanWallet
 *
 * Slices:
 *   auth     — user session (login/logout), persisted
 *   profile  — profile loading/update state (non-persisted, re-fetched on mount)
 *   history  — transaction history pagination
 *   transfer — receiver search results
 *   register — registration + PIN creation flow
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";

import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import historyReducer from "./slices/historySlice";
import transferReducer from "./slices/transferSlice";
import registerReducer from "./slices/registerSlice";

// Re-export auth actions for use across hooks/components
export {
  login,
  logout,
  mergeUser,
} from "./slices/authSlice";

export {
  clearProfileError,
  fetchProfile,
  updateProfile,
  changePassword,
  changePin,
} from "./slices/profileSlice";

// Only persist the auth slice (token + user identity)
const authPersistConfig = {
  key: "auth",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  profile: profileReducer,
  history: historyReducer,
  transfer: transferReducer,
  register: registerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// ── Legacy action exports for backward compatibility ──
// (store.js previously contained an inline authSlice with these actions)
export { mergeUser as setUser } from "./slices/authSlice";
export { logout as clearAuth } from "./slices/authSlice";

// These were inline in the old store.js — map to new profile slice or auth slice
import { createAction } from "@reduxjs/toolkit";

// Shims: dispatch these if old code still imports them
export const setAuthLoading = createAction("auth/setAuthLoading");
export const setAuthError = createAction("auth/setAuthError");
export const setProfileLoading = createAction("profile/setProfileLoading");
export const setProfileError = createAction("profile/setProfileError");
