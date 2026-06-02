/**
 * transactionSlice.js
 *
 * Owns all read-side transaction state (history, receiver search).
 * Write operations (topup, transfer, withdrawal, expense) are called
 * directly from component handlers via the api.js functions — they
 * don't need global loading/error state beyond local useState.
 *
 * Thunks:
 *   fetchHistory    GET /transaction/history?page=&limit=
 *   searchReceivers GET /transaction/receiver?q=&page=&limit=
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchHistory as apiFetchHistory,
  searchReceivers as apiSearchReceivers,
} from "../../utils/api";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchHistory = createAsyncThunk(
  "transaction/fetchHistory",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await apiFetchHistory({ page, limit });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const searchReceivers = createAsyncThunk(
  "transaction/searchReceivers",
  async ({ q = "", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await apiSearchReceivers({ q, page, limit });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    // History
    history: {
      items: [],
      page: 1,
      limit: 10,
      total: 0,
      status: "idle", // idle | loading | succeeded | failed
      error: null,
    },
    // Receiver search
    receivers: {
      items: [],
      page: 1,
      limit: 10,
      total: 0,
      status: "idle",
      error: null,
    },
  },
  reducers: {
    resetHistory(state) {
      state.history = {
        items: [],
        page: 1,
        limit: 10,
        total: 0,
        status: "idle",
        error: null,
      };
    },
    resetReceivers(state) {
      state.receivers = {
        items: [],
        page: 1,
        limit: 10,
        total: 0,
        status: "idle",
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    // ── fetchHistory ──
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.history.status = "loading";
        state.history.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history.status = "succeeded";
        state.history.items = action.payload.items;
        state.history.page = action.payload.page;
        state.history.limit = action.payload.limit;
        state.history.total = action.payload.total;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.history.status = "failed";
        state.history.error = action.payload;
      });

    // ── searchReceivers ──
    builder
      .addCase(searchReceivers.pending, (state) => {
        state.receivers.status = "loading";
        state.receivers.error = null;
      })
      .addCase(searchReceivers.fulfilled, (state, action) => {
        state.receivers.status = "succeeded";
        state.receivers.items = action.payload.items;
        state.receivers.page = action.payload.page;
        state.receivers.limit = action.payload.limit;
        state.receivers.total = action.payload.total;
      })
      .addCase(searchReceivers.rejected, (state, action) => {
        state.receivers.status = "failed";
        state.receivers.error = action.payload;
      });
  },
});

export const { resetHistory, resetReceivers } = transactionSlice.actions;
export default transactionSlice.reducer;
