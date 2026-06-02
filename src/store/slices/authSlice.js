/**
 * authSlice.js
 *
 * Manages the authenticated user session.
 * Persisted to localStorage via redux-persist (whitelist: ['user']).
 *
 * Actions:
 *   login(credentials)  — async thunk: POST /auth/login → GET /profile/info
 *   logout()            — synchronous: clears user from state
 *   mergeUser(partial)  — synchronous: shallow-merges fields into user
 *
 * State shape:
 *   { user: User | null, loading: bool, error: string | null }
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../utils/auth";

// ─── Async thunk ──────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
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
    /** Clears the session — called on logout */
    logout(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },

    /** Shallow-merges updated fields into the current user (e.g. after profile edit) */
    mergeUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
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
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, mergeUser } = authSlice.actions;
export default authSlice.reducer;
