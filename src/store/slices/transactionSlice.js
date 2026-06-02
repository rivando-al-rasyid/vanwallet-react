/**
 * transactionSlice.js
 *
 * Manages paginated transaction list state.
 * NOT persisted — data is re-fetched on mount.
 *
 * Actions:
 *   fetchTransactions({ page, limit }) — async thunk: GET /transaction
 *   resetTransactions()                — resets to initial state
 *
 * State shape:
 *   {
 *     items: Transaction[],
 *     page: number,
 *     limit: number,
 *     total: number,
 *     status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *     error: string | null,
 *   }
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllTransactions } from "../../utils/api";

// ─── Async thunk ──────────────────────────────────────────────────────────────

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await fetchAllTransactions({ page, limit });
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch transactions");
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    items: [],
    page: 1,
    limit: 10,
    total: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    resetTransactions(state) {
      state.items = [];
      state.page = 1;
      state.total = 0;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Backend returns { data: [], page, limit, total } inside envelope.data
        const payload = action.payload;
        state.items = payload?.data ?? payload ?? [];
        state.page = payload?.page ?? state.page;
        state.limit = payload?.limit ?? state.limit;
        state.total = payload?.total ?? 0;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch transactions";
      });
  },
});

export const { resetTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
