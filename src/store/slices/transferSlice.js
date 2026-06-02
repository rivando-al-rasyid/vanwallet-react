/**
 * transferSlice.js
 *
 * Manages the Transfer flow — Step 1: receiver search.
 * NOT persisted — cleared on page reload.
 *
 * Actions:
 *   searchTransferReceivers({ q, page, limit }) — async thunk: GET /transaction/receiver
 *   setSelectedReceiver(receiver)               — stores picked receiver for step 2
 *   resetTransfer()                             — resets entire transfer flow state
 *
 * State shape:
 *   {
 *     receivers: Receiver[],
 *     page: number,
 *     limit: number,
 *     total: number,
 *     selectedReceiver: Receiver | null,
 *     status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *     error: string | null,
 *   }
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchReceivers } from "../../utils/api";

// ─── Async thunk ──────────────────────────────────────────────────────────────

export const searchTransferReceivers = createAsyncThunk(
  "transfer/searchReceivers",
  async ({ q = "", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await searchReceivers({ q, page, limit });
    } catch (err) {
      return rejectWithValue(err.message || "Failed to search receivers");
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const transferSlice = createSlice({
  name: "transfer",
  initialState: {
    receivers: [],
    page: 1,
    limit: 10,
    total: 0,
    selectedReceiver: null,
    status: "idle",
    error: null,
  },
  reducers: {
    /** Stores the receiver the user picked in Step 1 */
    setSelectedReceiver(state, action) {
      state.selectedReceiver = action.payload;
    },

    /** Resets all transfer flow state — call when navigating away */
    resetTransfer(state) {
      state.receivers = [];
      state.page = 1;
      state.total = 0;
      state.selectedReceiver = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTransferReceivers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchTransferReceivers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.receivers = action.payload.items ?? [];
        state.page = action.payload.page ?? state.page;
        state.limit = action.payload.limit ?? state.limit;
        state.total = action.payload.total ?? 0;
      })
      .addCase(searchTransferReceivers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to search receivers";
      });
  },
});

export const { setSelectedReceiver, resetTransfer } = transferSlice.actions;
export default transferSlice.reducer;
