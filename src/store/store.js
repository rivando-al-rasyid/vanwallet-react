/**
 * store.js
 *
 * Redux store with 4 slices:
 *   auth        — in-memory user session, verified by /auth/me
 *   profile     — profile screen state
 *   register    — registration + first-time PIN flow
 *   transaction — history + receiver search
 */

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import registerReducer from "./slices/registerSlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    register: registerReducer,
    transaction: transactionReducer,
  },
});
