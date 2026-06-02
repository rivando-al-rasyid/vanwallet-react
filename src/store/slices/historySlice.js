/**
 * historySlice.js
 *
 * Manages transaction history state for the History page.
 * NOT persisted — data is re-fetched on mount.
 *
 * Actions:
 *   fetchHistoryWithUsers({ page, limit }) — async thunk:
 *     GET /transaction/history → normalizes items with transactionMeta
 *   resetHistory()                         — resets to initial state
 *
 * State shape:
 *   {
 *     items: NormalizedTransaction[],
 *     total: number,
 *     status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *     error: string | null,
 *   }
 *
 * NormalizedTransaction shape (used by TableRow, useTransactionFilter):
 *   {
 *     id, transactionType, transactionDesc, name, amount,
 *     sign, amountClass, badgeClass, createdAt, img
 *   }
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHistory, resolveAssetUrl } from "../../utils/api";
import { getTransactionMeta } from "../../utils/transactionMeta";

// ─── Normalizer ───────────────────────────────────────────────────────────────

function normalizeTransaction(tx) {
  const meta = getTransactionMeta(tx.type);
  return {
    id: tx.id ?? tx.transaction_id,
    transactionType: tx.type,
    transactionDesc: tx.note || tx.description || meta.label,
    name:
      tx.counterpart_name ||
      tx.merchant_name ||
      tx.bank_name ||
      meta.label,
    amount: tx.amount ?? 0,
    sign: meta.sign,
    amountClass: meta.amountClass,
    badgeClass: meta.badgeClass,
    createdAt: tx.created_at ?? tx.createdAt,
    img:
      resolveAssetUrl(tx.counterpart_photo) ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        tx.counterpart_name || meta.label,
      )}&background=EBF4FF&color=7F9CF5`,
  };
}

// ─── Async thunk ──────────────────────────────────────────────────────────────

export const fetchHistoryWithUsers = createAsyncThunk(
  "history/fetchWithUsers",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const result = await fetchHistory({ page, limit });
      return {
        items: (result.items ?? []).map(normalizeTransaction),
        total: result.total ?? 0,
        page: result.page ?? page,
        limit: result.limit ?? limit,
      };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch history");
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [],
    total: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    resetHistory(state) {
      state.items = [];
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
        state.total = action.payload.total;
      })
      .addCase(fetchHistoryWithUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch history";
      });
  },
});

export const { resetHistory } = historySlice.actions;
export default historySlice.reducer;
