import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactionsByUser } from "../../utils/transactionUtils";
import { getUserById } from "../../utils/userUtils";

// Fetches transactions for the current user, enriched with recipient user data.
// Uses GET /users/:userId/transactions (Tonic Fabricate endpoint).
export const fetchHistoryWithUsers = createAsyncThunk(
  "history/fetchHistoryWithUsers",
  async (userId, { rejectWithValue }) => {
    try {
      const historyItems = await getTransactionsByUser(userId);

      // Enrich each transaction with the related user's data (for display)
      const enrichedHistory = await Promise.all(
        historyItems.map(async (item) => {
          try {
            const userData = await getUserById(item.userId);
            return { ...item, user: userData };
          } catch {
            return { ...item, user: null };
          }
        }),
      );

      return enrichedHistory;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const historySlice = createSlice({
  name: "history",
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
