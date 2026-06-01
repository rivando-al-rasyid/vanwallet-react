/**
 * authSlice.js
 *
 * Owns the user session (persisted) and profile mutations.
 *
 * Thunks:
 *   login          POST /auth/login → setToken → GET /profile/info
 *   logout         POST /auth/logout → clearToken
 *   updateProfile  PATCH /profile/edit → re-fetch GET /profile/info
 *   changePassword PATCH /profile/change/password
 *   changePin      PATCH /profile/change/pin
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  logoutApi,
  fetchUserInfo,
  updateProfileApi,
  changePasswordApi,
  changePinApi,
  mapUserFromInfo,
  clearToken,
} from "../../utils/api";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginApi(credentials);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err) {
      clearToken();
      return rejectWithValue(err.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ fullName, phone, photoFile }, { rejectWithValue, getState }) => {
    try {
      await updateProfileApi({ fullName, phone, photoFile });
      const token = getState().auth.user?.token;
      const info = await fetchUserInfo();
      return mapUserFromInfo(info, token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await changePasswordApi(oldPassword, newPassword);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const changePin = createAsyncThunk(
  "auth/changePin",
  async ({ currentPin, newPin }, { rejectWithValue }) => {
    try {
      await changePinApi(currentPin, newPin);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    /** Set or replace the current user (used after register + after PIN update) */
    setUser(state, action) {
      state.user = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── login ──
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── logout ──
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });

    // ── updateProfile ──
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── changePassword ──
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── changePin ──
    builder
      .addCase(changePin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
