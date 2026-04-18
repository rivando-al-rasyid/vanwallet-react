import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, changePinApi } from "../../utils/auth";

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await registerUser({
        ...data,
        name: data.email?.split("@")[0] || "User",
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk khusus untuk set PIN pertama kali saat registrasi
export const createPin = createAsyncThunk(
  "auth/createPin",
  async ({ userId, pin }, { rejectWithValue }) => {
    try {
      return await changePinApi(userId, pin);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  token: null,      // reserved for token-based auth if needed later
  loading: false,
  error: null,
  pinLoading: false,
  pinError: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.loading = false;
      state.error = null;
      state.pinLoading = false;
      state.pinError = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
    clearPinError(state) {
      state.pinError = null;
    },
  },
  extraReducers: (builder) => {
    // ── login ──
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // User data lives in profileSlice; auth only tracks auth-level state
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── register ──
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
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
        state.pinError = null;
      })
      .addCase(createPin.rejected, (state, action) => {
        state.pinLoading = false;
        state.pinError = action.payload;
      });
  },
});

export const { logout, clearAuthError, clearPinError } = authSlice.actions;
export default authSlice.reducer;
