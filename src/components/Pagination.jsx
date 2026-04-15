/**
 * A reusable pagination control component.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  visibleCount,
  totalItems
}) {
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 9) },
    (_, i) => i + 1
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 border-t border-gray-100">
      <span className="text-xs sm:text-sm text-gray-400">
        Show {visibleCount} of {totalItems}
      </span>
      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-nowrap"
        >
          Prev
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm font-medium rounded-full transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-nowrap"
        >
          Next
        </button>
      </div>
    </div>
  );
}