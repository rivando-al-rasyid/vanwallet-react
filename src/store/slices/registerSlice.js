/**
 * registerSlice.js
 *
 * Handles the registration flow:
 *   1. register   POST /auth/register → auto-login → stores user in auth slice
 *   2. createPin  PATCH /profile/change/pin (first-time, no old_pin)
 *
 * After createPin succeeds the caller navigates to /dashboard.
 * This slice owns only its own loading/error; user state lives in authSlice.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerApi, setPinApi, getToken, mapUserFromInfo, fetchUserInfo } from "../../utils/api";
import { mergeUser } from "./authSlice";

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * POST /auth/register → auto-login.
 * On success, dispatches the resulting user into authSlice.
 */
export const register = createAsyncThunk(
  "register/register",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const user = await registerApi({ email, password });
      // Push authenticated user into the persisted auth slice
      dispatch(mergeUser(user));
      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * PATCH /profile/change/pin — first-time setup, only pin_hash required.
 * After success, re-fetches user info to update pin field in auth.user.
 */
export const createPin = createAsyncThunk(
  "register/createPin",
  async ({ pin }, { dispatch, getState, rejectWithValue }) => {
    try {
      await setPinApi(pin);
      const token = getState().auth.user?.token || getToken();
      const info = await fetchUserInfo();
      const updated = mapUserFromInfo(info, token);
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
    loading: false,
    pinLoading: false,
    error: null,
    pinError: null,
  },
  reducers: {
    clearRegisterErrors(state) {
      state.error = null;
      state.pinError = null;
    },
  },
  extraReducers: (builder) => {
    // ── register ──
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createPin ──
    builder
      .addCase(createPin.pending, (state) => {
        state.pinLoading = true;
        state.pinError = null;
      })
      .addCase(createPin.fulfilled, (state) => {
        state.pinLoading = false;
      })
      .addCase(createPin.rejected, (state, action) => {
        state.pinLoading = false;
        state.pinError = action.payload;
      });
  },
});

export const { clearRegisterErrors } = registerSlice.actions;
export default registerSlice.reducer;
