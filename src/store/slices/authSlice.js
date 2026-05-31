/**
 * authSlice.js
 *
 * Handles:
 *   POST /auth/login   → login thunk
 *   (logout is local + POST /auth/logout via logoutApi in useLogout hook)
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../utils/auth";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // loginUser: POST /auth/login → setToken → GET /profile/info → mapUserFromInfo
      return await loginUser(credentials);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    // Merge partial user updates (e.g. after profile edit or PIN set)
    mergeUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
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
        state.error = action.payload;
      });
  },
});

export const { logout, mergeUser } = authSlice.actions;
export default authSlice.reducer;
