/**
 * transactionSlice.js
 *
 * Centralizes transaction-related Redux state:
 *   - dashboard summary/report/recent history
 *   - history pagination
 *   - receiver search
 *   - top up request
 *   - transfer request
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSummary as apiFetchSummary,
  fetchHistory as apiFetchHistory,
  searchReceivers as apiSearchReceivers,
  initiateTopup as apiInitiateTopup,
  createTransfer as apiCreateTransfer,
} from "../../utils/api";

function getErrorMessage(error, fallback = "Request failed") {
  return error?.message || fallback;
}

function getFirstWalletId(summary) {
  return summary?.wallets?.[0]?.id || summary?.wallet_id || summary?.walletId || null;
}

const DASHBOARD_HISTORY_PAGE_SIZE = 100;
const DASHBOARD_HISTORY_MAX_PAGES = 10;

function parseRangeDays(range) {
  const parsedDays = Number.parseInt(String(range).replace(/\D/g, ""), 10);

  if (Number.isFinite(parsedDays) && parsedDays > 0) {
    return parsedDays;
  }

  return 7;
}

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function getDateRange(days) {
  const endDate = new Date();
  const startDate = new Date(endDate);

  startDate.setDate(endDate.getDate() - days + 1);

  return {
    startDate: toDateInputValue(startDate),
    endDate: toDateInputValue(endDate),
  };
}

function getGraphLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(date);
}

function createEmptyGraphBuckets(days) {
  const buckets = new Map();
  const today = new Date();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);

    const key = toDateInputValue(date);

    buckets.set(key, {
      date: key,
      label: getGraphLabel(date),
      income: 0,
      expense: 0,
    });
  }

  return buckets;
}

function buildReportFromHistory(items, days) {
  const buckets = createEmptyGraphBuckets(days);

  items.forEach((transaction) => {
    const createdAt = transaction.createdAt || transaction.created_at;

    if (!createdAt) {
      return;
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = toDateInputValue(date);
    const bucket = buckets.get(key);

    if (!bucket) {
      return;
    }

    const amount = Number(transaction.rawAmount ?? transaction.amount ?? 0);

    if (!Number.isFinite(amount)) {
      return;
    }

    if (transaction.type === "income" || transaction.direction === "income") {
      bucket.income += amount;
      return;
    }

    bucket.expense += amount;
  });

  return {
    points: Array.from(buckets.values()),
  };
}

async function fetchDashboardGraphHistory({ range = "7days", type = "both" } = {}) {
  const days = parseRangeDays(range);
  const { startDate, endDate } = getDateRange(days);
  const direction = type === "income" || type === "expense" ? type : "";
  const items = [];
  let page = 1;
  let totalPages = 1;

  do {
    const history = await apiFetchHistory({
      page,
      limit: DASHBOARD_HISTORY_PAGE_SIZE,
      direction,
      startDate,
      endDate,
    });

    items.push(...history.items);
    totalPages = history.totalPages || 1;
    page += 1;
  } while (page <= totalPages && page <= DASHBOARD_HISTORY_MAX_PAGES);

  return buildReportFromHistory(items, days);
}

export const fetchDashboard = createAsyncThunk(
  "transaction/fetchDashboard",
  async ({ range = "7days", type = "both", historyLimit = 6 } = {}, { rejectWithValue }) => {
    try {
      const [summary, report, history] = await Promise.all([
        apiFetchSummary(),
        fetchDashboardGraphHistory({ range, type }),
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
  async (params = {}, { rejectWithValue }) => {
    try {
      return await apiFetchHistory(params);
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
  async ({ walletId, amount, paymentMethod }, { rejectWithValue }) => {
    try {
      return await apiInitiateTopup({ walletId, amount, paymentMethod });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to initiate top up"));
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
  totalPages: 1,
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
        state.history.totalPages = action.payload.totalPages;
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
        state.receivers.totalPages = action.payload.totalPages;
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
