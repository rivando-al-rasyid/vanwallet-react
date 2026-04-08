import { memo } from "react";

const BADGE_CONFIG = {
  income: {
    className: "bg-green-50 text-green-600 border border-green-200",
    symbol: "↑",
  },
  expense: {
    className: "bg-red-50 text-red-500 border border-red-200",
    symbol: "↓",
  },
};

const Badge = memo(function Badge({ type }) {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.symbol} {label}
    </span>
  );
});

export default Badge;
