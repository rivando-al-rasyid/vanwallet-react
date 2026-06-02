/**
 * historySlice.js
 *
 * Uses GET /transactions/history (paginated, user-friendly logs)
 * instead of the old Tonic Fabricate GET /users/:id/transactions.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHistory } from "../../utils/api";

/**
 * Fetches paginated transaction history for the current user.
 * Accepts { page, limit } options.
 * Returns { items, page, limit, total }
 */
export const fetchHistoryWithUsers = createAsyncThunk(
  "history/fetchHistoryWithUsers",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await fetchHistory({ page, limit });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [],
    page: 1,
    limit: 10,
    total: 0,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    resetHistory: (state) => {
      state.items = [];
      state.page = 1;
      state.limit = 10;
      state.total = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoryWithUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHistoryWithUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(fetchHistoryWithUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetHistory } = historySlice.actions;
export default historySlice.reducer;
