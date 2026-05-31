/**
 * registerSlice.js
 *
 * Handles:
 *   - POST /auth/register  → create user
 *   - PATCH /profile/change/pin → set initial PIN (no old_pin)
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser } from "../../utils/auth";
import { setPinApi } from "../../utils/api";

export const register = createAsyncThunk(
  "register/create",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // POST /auth/register then auto-login → returns full user object
      return await registerUser({ email, password });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createPin = createAsyncThunk(
  "register/createPin",
  async ({ pin }, { rejectWithValue }) => {
    try {
      // PATCH /profile/change/pin — first-time setup, no old_pin required
      await setPinApi(pin);
      return { pinSet: true };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  registerData: null,
  registerLoading: false,
  registerError: null,

  pinLoading: false,
  pinError: null,
  pinSuccess: false,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.registerData = null;
      state.registerLoading = false;
      state.registerError = null;
      state.pinLoading = false;
      state.pinError = null;
      state.pinSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.registerData = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      })

      // createPin
      .addCase(createPin.pending, (state) => {
        state.pinLoading = true;
        state.pinError = null;
        state.pinSuccess = false;
      })
      .addCase(createPin.fulfilled, (state) => {
        state.pinLoading = false;
        state.pinSuccess = true;
      })
      .addCase(createPin.rejected, (state, action) => {
        state.pinLoading = false;
        state.pinError = action.payload;
        state.pinSuccess = false;
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
