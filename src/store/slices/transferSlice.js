import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers } from "../../utils/userUtils";

export const fetchAllUsers = createAsyncThunk(
  "transfer/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllUsers();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const transferSlice = createSlice({
  name: "transfer",
  initialState: {
    users: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default transferSlice.reducer;
