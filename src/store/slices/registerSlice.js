/**
 * registerSlice.js
 *
 * Handles the registration flow:
 *   1. register   POST /auth/register → dispatches login thunk → auth.user set correctly
 *   2. createPin  PATCH /profile/change/pin (first-time, no old_pin)
 *                 → re-fetches user info → updates auth.user via setUser
 *
 * After createPin succeeds the caller navigates to /dashboard.
 * This slice owns only its own loading/error; user state lives in authSlice.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerApi, setPinApi, getToken, mapUserFromInfo, fetchUserInfo } from "../../utils/api";

// Imported here to avoid circular dependency — authSlice does not import registerSlice
import { login, setUser } from "./authSlice";

// ─── Thunks ───────────────────────────────────────────────────────────────────

/**
 * POST /auth/register → auto-login via login thunk.
 * Delegates session storage entirely to the login thunk so auth.user
 * is guaranteed to be set (token + full user object) in Redux.
 */
export const register = createAsyncThunk(
  "register/register",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      // Register the account (server-side only, no token returned)
      await registerApi({ email, password });
      // Dispatch the existing login thunk to set auth.user correctly
      const result = await dispatch(login({ email, password }));
      if (login.rejected.match(result)) {
        return rejectWithValue(result.payload || "Auto-login setelah register gagal.");
      }
      return result.payload;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * PATCH /profile/change/pin — first-time PIN setup (no old_pin required).
 * After success, re-fetches user info and replaces auth.user via setUser.
 */
export const createPin = createAsyncThunk(
  "register/createPin",
  async ({ pin }, { dispatch, getState, rejectWithValue }) => {
    try {
      await setPinApi(pin);
      const token = getState().auth.user?.token || getToken();
      const info = await fetchUserInfo();
      const updated = mapUserFromInfo(info, token);
      dispatch(setUser(updated));
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
