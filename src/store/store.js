import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/es/storage";

import authReducer from "./slices/authSlice";
import registerReducer from "./slices/registerSlice";
import profileReducer from "./slices/profileSlice";
import transferReducer from "./slices/transferSlice";

// ─── Persist config ───────────────────────────────────────────────────────────
// Persist user data AND avatarPath so the selected local image survives refresh.

const profilePersistConfig = {
  key: "profile",
  storage,
  whitelist: ["user", "avatarPath"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  profile: persistReducer(profilePersistConfig, profileReducer),
  register: registerReducer,
  transfer: transferReducer,
});
// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }),
});

export const persistor = persistStore(store);
