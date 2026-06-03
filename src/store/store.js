/**
 * store.js
 *
 * Redux store with 4 slices:
 *   auth        — user session (persisted to localStorage)
 *   profile     — profile screen state
 *   register    — registration + first-time PIN flow (not persisted)
 *   transaction — history + receiver search (not persisted)
 */

import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage";

import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import registerReducer from "./slices/registerSlice";
import transactionReducer from "./slices/transactionSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    profile: profileReducer,
    register: registerReducer,
    transaction: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
