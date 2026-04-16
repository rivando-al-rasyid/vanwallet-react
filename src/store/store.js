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
import profileReducer from "./slices/profileSlice";

// ─── Persist config ───────────────────────────────────────────────────────────
// Only profile (user data) needs to survive a page reload.
// Auth loading/error state is ephemeral — no point persisting it.

const profilePersistConfig = {
  key: "profile",
  storage,
  whitelist: ["user"], // only persist user data, not loading/error
};

const rootReducer = combineReducers({
  auth: authReducer,
  profile: persistReducer(profilePersistConfig, profileReducer),
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
