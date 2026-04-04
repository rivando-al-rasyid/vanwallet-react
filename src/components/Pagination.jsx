import React from "react";

export default function Pagination({
  current,
  total,
  onChange,
  shownCount,
  totalCount,
}) {
  const pages = Array.from({ length: Math.min(total, 9) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between px-2 py-3 border-t border-gray-100 mt-2">
      <span className="text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">{shownCount}</span> of{" "}
        <span className="font-semibold text-gray-600">{totalCount}</span>{" "}
        records
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-blue-50 transition"
        >
          ← Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-7 h-7 text-xs font-semibold rounded-full transition-colors ${current === p ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === total}
          className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-blue-50 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
