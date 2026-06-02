/**
 * registerSlice.js
 *
 * Manages the multi-step registration flow.
 * NOT persisted — cleared on page reload.
 *
 * Steps:
 *   1. Register (POST /auth/register) → auto-login
 *   2. Set PIN (PATCH /profile/change/pin) — first-time setup
 *
 * Actions:
 *   register(credentials) — async thunk: POST /auth/register → auto-login
 *   resetRegister()       — resets state back to initial
 *
 * State shape:
 *   { user: User | null, loading: bool, error: string | null }
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser } from "../../utils/auth";

// ─── Async thunk ──────────────────────────────────────────────────────────────

export const register = createAsyncThunk(
  "register/register",
  async (credentials, { rejectWithValue }) => {
    try {
      // registerUser: POST /auth/register → auto-login → returns user object
      return await registerUser(credentials);
    } catch (err) {
      return rejectWithValue(err.message || "Registration failed");
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const registerSlice = createSlice({
  name: "register",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    /** Resets registration state — called after PIN is set or user navigates away */
    resetRegister(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { resetRegister } = registerSlice.actions;
export default registerSlice.reducer;
