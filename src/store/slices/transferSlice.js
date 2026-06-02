/**
 * transferSlice.js
 *
 * Uses GET /transactions/receivers?q=&page=&limit= (search system profiles)
 * instead of the old GET /users (Tonic Fabricate).
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchReceivers } from "../../utils/api";

export const fetchAllUsers = createAsyncThunk(
  "transfer/fetchAllUsers",
  async ({ q = "", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
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
    limit: 10,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    resetTransfer: (state) => {
      state.users = [];
      state.total = 0;
      state.page = 1;
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
