/**
 * transferSlice.js
 *
 * Manages receiver search state for the Transfer flow (Step 1).
 * Calls GET /transaction/receiver?q=&page=&limit=
 *
 * When `q` is empty, the API returns all available receivers (no filter).
 * The Transfer page dispatches fetchAllUsers on mount so contacts are
 * visible immediately without requiring the user to type anything first.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchReceivers } from "../../utils/api";

export const fetchAllUsers = createAsyncThunk(
  "transfer/fetchAllUsers",
  async ({ q = "", page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const result = await searchReceivers({ q, page, limit });
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const transferSlice = createSlice({
  name: "transfer",
  initialState: {
    users: [],
    total: 0,
    page: 1,
    limit: 6,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    resetTransfer: (state) => {
      state.users = [];
      state.total = 0;
      state.page = 1;
      state.limit = 6;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetTransfer } = transferSlice.actions;
export default transferSlice.reducer;
