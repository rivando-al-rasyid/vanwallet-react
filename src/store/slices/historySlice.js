import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllHistory } from "../../utils/auth";

export const fetchAllHistory = createAsyncThunk(
  "transfer/fetchAllHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllHistory();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const historySlice = createSlice({
  name: "History",
  initialState: {
    history: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    resetHistory: (state) => {
      state.history = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchAllHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetHistory } = historySlice.actions;
export default historySlice.reducer;
