import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, changePinApi } from "../../utils/auth";

export const register = createAsyncThunk(
  "register/create",
  async (data, { rejectWithValue }) => {
    try {
      return await registerUser({
        ...data,
        name: data.email?.split("@")[0] || "User",
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createPin = createAsyncThunk(
  "register/createPin",
  async ({ userId, pin }, { rejectWithValue }) => {
    try {
      return await changePinApi(userId, pin);
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

      // create pin
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
