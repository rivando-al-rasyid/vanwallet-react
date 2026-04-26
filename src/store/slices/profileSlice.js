import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout } from "./authSlice";
import { register, createPin } from "./registerSlice";
import {
  updateUser,
  changePassword as changePasswordApi,
  changePinApi,
} from "../../utils/userUtils";
import { getBalance } from "../../utils/balanceUtils";

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const { getUserById } = await import("../../utils/userUtils");
      return await getUserById(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Separate thunk for balance — hits GET /balances/:userId
export const fetchBalance = createAsyncThunk(
  "profile/fetchBalance",
  async (userId, { rejectWithValue }) => {
    try {
      return await getBalance(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      return await updateUser(userId, payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async ({ userId, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await changePasswordApi({ userId, oldPassword, newPassword });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const changePin = createAsyncThunk(
  "profile/changePin",
  async ({ userId, newPin }, { rejectWithValue }) => {
    try {
      return await changePinApi(userId, newPin);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  user: null,
  balance: null,        // { userId, balance, updatedAt }
  avatarPath: null,
  loading: false,
  balanceLoading: false,
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
    setAvatar(state, action) {
      state.avatarPath = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── Auth cross-slice effects ──
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.balance = null; // will be fetched separately
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.balance = null;
        state.error = null;
      })
      .addCase(logout, (state) => {
        state.user = null;
        state.balance = null;
        state.avatarPath = null;
        state.loading = false;
        state.error = null;
      });

    builder.addCase(createPin.fulfilled, (state, action) => {
      if (action.payload && state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    });

    // ── fetchProfile ──
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchBalance ──
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.balanceLoading = true;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.balance = action.payload;
      })
      .addCase(fetchBalance.rejected, (state) => {
        state.balanceLoading = false;
      });

    // ── updateProfile ──
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
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
      .addCase(changePin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(changePin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, setAvatar } = profileSlice.actions;
export default profileSlice.reducer;
