/**
 * transactionMeta.js
 *
 * Maps transaction types from the Swagger API to UI display metadata.
 * Types come from GET /transactions/history response `type` field.
 *
 * Swagger-defined transaction types:
 *   TOPUP        → income  (POST /transactions/topup)
 *   TRANSFER_IN  → income  (received transfer)
 *   TRANSFER_OUT → expense (POST /transactions/transfer)
 *   WITHDRAW     → expense (POST /transactions/withdraw)
 *   EXPENSE      → expense (POST /transactions/expense)
 */

const DEFAULT_TRANSACTION_META = {
  label: "Transaction",
  badgeClass: "badge-warning",
  sign: "",
  amountClass: "text-gray-700",
};

const TRANSACTION_TYPE_META = {
  // ── Income types ──────────────────────────────────────────────
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

  // ── Expense types ─────────────────────────────────────────────
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

  // ── Legacy types (Tonic Fabricate compat) ─────────────────────
  deposit: {
    label: "Deposit",
    badgeClass: "badge-success",
    sign: "+",
    amountClass: "text-green-600",
  },
  payment: {
    label: "Payment",
    badgeClass: "badge-danger",
    sign: "-",
    amountClass: "text-red-500",
  },
  invoice: {
    label: "Invoice",
    badgeClass: "badge-warning",
    sign: "",
    amountClass: "text-gray-700",
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

/**
 * Returns true if the transaction type is an income (credit) type
 */
export function isIncomeType(transactionType) {
  const meta = getTransactionMeta(transactionType);
  return meta.sign === "+";
}
