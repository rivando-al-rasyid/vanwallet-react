/**
 * store.js
 *
 * Redux store with 4 slices:
 *   auth        — user session (persisted to localStorage)
 *   register    — registration + first-time PIN flow (not persisted)
 *   transaction — history + receiver search (not persisted)
 *   transfer    — receiver search state for Transfer flow Step 1 (not persisted)
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
import registerReducer from "./slices/registerSlice";
import transactionReducer from "./slices/transactionSlice";
import transferReducer from "./slices/transferSlice";
import historyReducer from "./slices/historySlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    register: registerReducer,
    transaction: transactionReducer,
    transfer: transferReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
