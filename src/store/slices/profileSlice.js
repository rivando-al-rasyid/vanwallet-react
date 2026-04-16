import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout } from "./authSlice";
import {
  updateUser,
  changePassword as changePasswordApi,
  changePinApi,
} from "../../utils/auth";

// ─── Avatar upload to freeimage.host ─────────────────────────────────────────

/**
 * Uploads a File object to freeimage.host and returns the direct image URL.
 * The returned URL can be used directly in <img src="..." />.
 */
async function uploadAvatarToFreeImageHost(file) {
  const formData = new FormData();
  formData.append("source", file);
  formData.append("type", "file");
  formData.append("action", "upload");

  const res = await fetch("https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Avatar upload gagal. Coba lagi.");

  const data = await res.json();

  if (data.status_code !== 200) {
    throw new Error(data.error?.message || "Upload gagal.");
  }

  // Return the direct display URL (not thumbnail, not viewer page)
  return data.image.display_url;
}

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const { getUserById } = await import("../../utils/auth");
      return await getUserById(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      return await updateUser(userId, payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async ({ userId, file }, { getState, rejectWithValue }) => {
    try {
      const avatarUrl = await uploadAvatarToFreeImageHost(file);
      // Persist the new avatar URL to the backend
      const updated = await updateUser(userId, { avatar: avatarUrl });
      return updated;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async ({ userId, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await changePasswordApi({ userId, oldPassword, newPassword });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changePin = createAsyncThunk(
  "profile/changePin",
  async ({ userId, newPin }, { rejectWithValue }) => {
    try {
      return await changePinApi(userId, newPin);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
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
    // When login or register succeeds, hydrate user into profile
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logout, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
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

    // ── uploadAvatar ──
    builder
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
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

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
