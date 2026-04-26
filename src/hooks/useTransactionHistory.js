import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistoryWithUsers } from "../store/slices/historySlice";
import { getTransactionMeta } from "../utils/transactionMeta";

/**
 * useTransactionHistory
 *
 * Fetches transaction history for the current logged-in user from Redux.
 * Uses GET /users/:userId/transactions (Tonic Fabricate API).
 *
 * Returns:
 *   transactions  — normalized + sorted array, ready to render
 *   status        — "idle" | "loading" | "succeeded" | "failed"
 *   error         — string or null
 *   reload        — function to re-dispatch the fetch
 */
export function useTransactionHistory() {
  const dispatch = useDispatch();
  const { history, status, error } = useSelector((state) => state.history);
  const userId = useSelector((state) => state.profile.user?.id ?? null);

  useEffect(() => {
    if (status === "idle" && userId) {
      dispatch(fetchHistoryWithUsers(userId));
    }
  }, [dispatch, status, userId]);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));

  const transactions = [...history]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((item) => {
      const meta = getTransactionMeta(item.transactionType);
      return {
        ...item,
        name: item.user?.name ?? "Unknown",
        avatar: item.user?.avatar ?? "",
        phone: item.user?.phone ?? "-",
        badgeClass: meta.badgeClass,
        badgeLabel: meta.label,
        sign: meta.sign,
        amountClass: meta.amountClass,
        formattedAmount: formatAmount(item.amount),
        formattedDate: item.createdAt,
      };
    });

  const reload = () => {
    if (userId) dispatch(fetchHistoryWithUsers(userId));
  };

  return { transactions, status, error, reload };
}
