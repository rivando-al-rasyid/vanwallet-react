import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllHistory, getUserById } from "../../utils/auth";

export const fetchHistoryWithUsers = createAsyncThunk(
  "transfer/fetchHistoryWithUsers",
  async (_, { rejectWithValue }) => {
    try {
      const historyItems = await getAllHistory();

      // Use Promise.all to fetch all users in parallel
      const enrichedHistory = await Promise.all(
        historyItems.map(async (item) => {
          const userData = await getUserById(item.userId);
          return { ...item, user: userData };
        }),
      );

      return enrichedHistory;
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
      .addCase(fetchHistoryWithUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistoryWithUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchHistoryWithUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetHistory } = historySlice.actions;
export default historySlice.reducer;
