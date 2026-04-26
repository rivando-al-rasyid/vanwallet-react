const DEFAULT_TRANSACTION_META = {
  label: "Unknown",
  badgeClass: "badge-warning",
  sign: "",
  amountClass: "text-gray-700",
};

const TRANSACTION_TYPE_META = {
  deposit: {
    label: "Deposit",
    badgeClass: "badge-success",
    sign: "+",
    amountClass: "text-green-600",
  },
  withdrawal: {
    label: "Withdrawal",
    badgeClass: "badge-danger",
    sign: "-",
    amountClass: "text-red-500",
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
  const matchedMeta = key ? TRANSACTION_TYPE_META[key] : null;

  if (matchedMeta) return matchedMeta;

  return {
    ...DEFAULT_TRANSACTION_META,
    label: transactionType || DEFAULT_TRANSACTION_META.label,
  };
}
