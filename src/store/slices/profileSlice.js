/**
 * profileSlice.js
 *
 * Manages user profile state using utils/api.js:
 *   GET   /auth/me                 → fetchUserInfo
 *   GET   /profile                 → fetchProfile
 *   PATCH /profile/edit            → updateProfileApi
 *   PATCH /profile/change/password → changePasswordApi
 *   PATCH /profile/change/pin      → changePinApi
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout } from "./authSlice";
import { register } from "./registerSlice";
import {
  fetchUserInfo,
  fetchProfile,
  updateProfileApi,
  changePasswordApi,
  changePinApi,
  mapUserFromInfo,
} from "../../utils/api";

// ─── Thunks ──────────────────────────────────────────────────────────────────

/**
 * Loads current user summary from GET /auth/me
 */
export const fetchProfileThunk = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const info = await fetchUserInfo();
      return mapUserFromInfo(info);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Updates profile fields via PATCH /profile/edit
 * Re-fetches profile after update to sync state
 */
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ fullName, phone, photoFile }, { rejectWithValue }) => {
    try {
      await updateProfileApi({ fullName, phone, photoFile });
      const info = await fetchUserInfo();
      return mapUserFromInfo(info);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Changes login password via PATCH /profile/change/password
 */
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await changePasswordApi(oldPassword, newPassword);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/**
 * Changes PIN via PATCH /profile/change/pin
 */
export const changePin = createAsyncThunk(
  "profile/changePin",
  async ({ currentPin, newPin }, { rejectWithValue }) => {
    try {
      await changePinApi(currentPin, newPin);
      return { pinUpdated: true };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  user: null,
  loading: false,
  error: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Auth cross-slice effects ──
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
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

    // ── fetchProfileThunk ──
    builder
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;

// ── backward-compat alias ──
export { fetchProfileThunk as fetchProfile };
