/**
 * transactionSlice.js
 *
 * Centralizes transaction-related Redux state:
 *   - dashboard summary/report/recent history
 *   - history pagination
 *   - receiver search
 *   - top up request/confirmation
 *   - transfer request
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSummary as apiFetchSummary,
  fetchReport as apiFetchReport,
  fetchHistory as apiFetchHistory,
  searchReceivers as apiSearchReceivers,
  initiateTopup as apiInitiateTopup,
  confirmTopup as apiConfirmTopup,
  createTransfer as apiCreateTransfer,
} from "../../utils/api";

function getErrorMessage(error, fallback = "Request failed") {
  return error?.message || fallback;
}

function getFirstWalletId(summary) {
  return summary?.wallets?.[0]?.id || summary?.wallet_id || summary?.walletId || null;
}

export const fetchDashboard = createAsyncThunk(
  "transaction/fetchDashboard",
  async ({ range = "7days", type = "both", historyLimit = 6 } = {}, { rejectWithValue }) => {
    try {
      const [summary, report, history] = await Promise.all([
        apiFetchSummary(),
        apiFetchReport({ range, type }),
        apiFetchHistory({ page: 1, limit: historyLimit }),
      ]);

      return {
        summary,
        report,
        recentTransactions: history.items,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load dashboard"));
    }
  },
);

export const fetchSummary = createAsyncThunk(
  "transaction/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchSummary();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch summary"));
    }
  },
);

export const fetchHistory = createAsyncThunk(
  "transaction/fetchHistory",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await apiFetchHistory({ page, limit });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch history"));
    }
  },
);

export const searchReceivers = createAsyncThunk(
  "transaction/searchReceivers",
  async ({ q = "", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await apiSearchReceivers({ q, page, limit });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch receivers"));
    }
  },
);

export const initiateTopup = createAsyncThunk(
  "transaction/initiateTopup",
  async ({ walletId, amount, paymentMethod, pin }, { rejectWithValue }) => {
    try {
      return await apiInitiateTopup({ walletId, amount, paymentMethod, pin });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to initiate top up"));
    }
  },
);

export const confirmTopup = createAsyncThunk(
  "transaction/confirmTopup",
  async (topupId, { rejectWithValue }) => {
    try {
      return await apiConfirmTopup(topupId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to confirm top up"));
    }
  },
);

export const createTransfer = createAsyncThunk(
  "transaction/createTransfer",
  async ({ senderWalletId, recipientWalletId, amount, note, pin }, { rejectWithValue }) => {
    try {
      let resolvedSenderWalletId = senderWalletId;

      if (!resolvedSenderWalletId) {
        const summary = await apiFetchSummary();
        resolvedSenderWalletId = getFirstWalletId(summary);
      }

      if (!resolvedSenderWalletId) {
        throw new Error("Sender wallet was not found.");
      }

      return await apiCreateTransfer({
        senderWalletId: resolvedSenderWalletId,
        recipientWalletId,
        amount,
        note,
        pin,
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Transfer failed"));
    }
  },
);

const emptyPaginatedState = {
  items: [],
  page: 1,
  limit: 10,
  total: 0,
  status: "idle",
  error: null,
};

const initialState = {
  dashboard: {
    summary: null,
    report: null,
    recentTransactions: [],
    status: "idle",
    error: null,
  },
  summary: {
    data: null,
    status: "idle",
    error: null,
  },
  history: { ...emptyPaginatedState },
  receivers: { ...emptyPaginatedState },
  topup: {
    pendingTopup: null,
    status: "idle",
    error: null,
  },
  transfer: {
    result: null,
    status: "idle",
    error: null,
  },
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    resetHistory(state) {
      state.history = { ...emptyPaginatedState };
    },
    resetReceivers(state) {
      state.receivers = { ...emptyPaginatedState };
    },
    resetTopup(state) {
      state.topup = { pendingTopup: null, status: "idle", error: null };
    },
    resetTransfer(state) {
      state.transfer = { result: null, status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboard.status = "loading";
        state.dashboard.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard.status = "succeeded";
        state.dashboard.summary = action.payload.summary;
        state.dashboard.report = action.payload.report;
        state.dashboard.recentTransactions = action.payload.recentTransactions;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboard.status = "failed";
        state.dashboard.error = action.payload;
      });

    builder
      .addCase(fetchSummary.pending, (state) => {
        state.summary.status = "loading";
        state.summary.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary.status = "succeeded";
        state.summary.data = action.payload;
        state.dashboard.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.summary.status = "failed";
        state.summary.error = action.payload;
      });

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

    builder
      .addCase(initiateTopup.pending, (state) => {
        state.topup.status = "loading";
        state.topup.error = null;
      })
      .addCase(initiateTopup.fulfilled, (state, action) => {
        state.topup.status = "succeeded";
        state.topup.pendingTopup = action.payload;
      })
      .addCase(initiateTopup.rejected, (state, action) => {
        state.topup.status = "failed";
        state.topup.error = action.payload;
      })
      .addCase(confirmTopup.pending, (state) => {
        state.topup.status = "loading";
        state.topup.error = null;
      })
      .addCase(confirmTopup.fulfilled, (state) => {
        state.topup.status = "succeeded";
        state.topup.pendingTopup = null;
      })
      .addCase(confirmTopup.rejected, (state, action) => {
        state.topup.status = "failed";
        state.topup.error = action.payload;
      });

    builder
      .addCase(createTransfer.pending, (state) => {
        state.transfer.status = "loading";
        state.transfer.error = null;
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.transfer.status = "succeeded";
        state.transfer.result = action.payload;
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.transfer.status = "failed";
        state.transfer.error = action.payload;
      });
  },
});

export const { resetHistory, resetReceivers, resetTopup, resetTransfer } = transactionSlice.actions;
export default transactionSlice.reducer;
