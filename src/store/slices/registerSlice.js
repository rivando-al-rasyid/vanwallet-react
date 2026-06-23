/**
 * registerSlice.js
 *
 * Owns the registration flow:
 *   register   POST /auth/register → auto-login → store user
 *   createPin  PATCH /profile/change/pin (first-time setup, no old_pin)
 *
 * Registration state resets on page reload after registration is complete.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerApi,
  setPinApi,
  fetchUserInfo,
  mapUserFromInfo,
} from "../../utils/api";
import { mergeUser } from "./authSlice";

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * POST /auth/register then auto-login.
 * Returns a mapped user object (same shape as auth.user).
 */
export const register = createAsyncThunk(
  "register/register",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const user = await registerApi({ email, password });
      // Sync auth state so the next screen receives the latest user
      dispatch(mergeUser(user));
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * PATCH /profile/change/pin — first-time PIN setup (no old_pin).
 * After saving, re-fetches /auth/me so auth.user.pin is updated.
 */
export const createPin = createAsyncThunk(
  "register/createPin",
  async ({ pin }, { rejectWithValue, dispatch }) => {
    try {
      await setPinApi(pin);
      const info = await fetchUserInfo();
      const updated = mapUserFromInfo(info);
      // Keep auth slice in sync
      dispatch(mergeUser(updated));
      return updated;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const registerSlice = createSlice({
  name: "register",
  initialState: {
    user: null,
    loading: false,
    pinLoading: false,
    error: null,
  },
  reducers: {
    clearRegisterError(state) {
      state.error = null;
    },
    resetRegister() {
      return { user: null, loading: false, pinLoading: false, error: null };
    },
  },
  extraReducers: (builder) => {
    // ── register ──
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
        state.error = action.payload;
      });

    // ── createPin ──
    builder
      .addCase(createPin.pending, (state) => {
        state.pinLoading = true;
        state.error = null;
      })
      .addCase(createPin.fulfilled, (state, action) => {
        state.pinLoading = false;
        state.user = action.payload;
      })
      .addCase(createPin.rejected, (state, action) => {
        state.pinLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRegisterError, resetRegister } = registerSlice.actions;
export default registerSlice.reducer;
