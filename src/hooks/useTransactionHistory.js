/**
 * useTransactionHistory.js
 *
 * Fetches paginated transaction history from GET /transactions/history.
 * Returns normalized items ready for rendering.
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistoryWithUsers } from "../store/slices/historySlice";

export function useTransactionHistory({ page = 1, limit = 10 } = {}) {
  const dispatch = useDispatch();
  const { items, total, status, error } = useSelector((state) => state.history);

  const reload = useCallback(() => {
    dispatch(fetchHistoryWithUsers({ page, limit }));
  }, [dispatch, page, limit]);

  return {
    // Backward-compat alias: old code used `transactions`
    transactions: items,
    items,
    total,
    status,
    error,
    reload,
  };
}
