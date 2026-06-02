/**
 * transactionMeta.js
 *
 * Maps transaction types from the backend to UI display metadata.
 * Types come from GET /transaction/history response `type` field.
 *
 * Backend transaction types:
 *   TOPUP        → income
 *   TRANSFER_IN  → income
 *   TRANSFER_OUT → expense
 *   WITHDRAWAL   → expense
 *   EXPENSE      → expense
 */

const DEFAULT_TRANSACTION_META = {
  label: "Transaction",
  badgeClass: "badge-warning",
  sign: "",
  amountClass: "text-gray-700",
};

const TRANSACTION_TYPE_META = {
  topup: {
    label: "Top Up",
    badgeClass: "badge-success",
    sign: "+",
    amountClass: "text-green-600",
  },
  transfer_in: {
    label: "Transfer In",
    badgeClass: "badge-success",
    sign: "+",
    amountClass: "text-green-600",
  },
  transfer_out: {
    label: "Transfer Out",
    badgeClass: "badge-danger",
    sign: "-",
    amountClass: "text-red-500",
  },
  withdraw: {
    label: "Withdraw",
    badgeClass: "badge-danger",
    sign: "-",
    amountClass: "text-red-500",
  },
  withdrawal: {
    label: "Withdrawal",
    badgeClass: "badge-danger",
    sign: "-",
    amountClass: "text-red-500",
  },
  expense: {
    label: "Expense",
    badgeClass: "badge-danger",
    sign: "-",
    amountClass: "text-red-500",
  },
};

export function getTransactionMeta(transactionType) {
  const key = transactionType?.toLowerCase();
  return (
    TRANSACTION_TYPE_META[key] ?? {
      ...DEFAULT_TRANSACTION_META,
      label: transactionType || DEFAULT_TRANSACTION_META.label,
    }
  );
}

export function isIncomeType(transactionType) {
  return getTransactionMeta(transactionType).sign === "+";
}
