/**
 * A reusable pagination control component.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  visibleCount,
  totalItems,
}) {
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 9) },
    (_, i) => i + 1,
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-4 lg:px-8">
      <span className="text-xs text-gray-400 sm:text-sm">
        Show {visibleCount} of {totalItems}
      </span>
      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-xs font-medium text-nowrap text-gray-500 transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:text-sm"
        >
          Prev
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-7 w-7 rounded-full text-xs font-medium transition-colors sm:h-8 sm:w-8 sm:text-sm ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-xs font-medium text-nowrap text-gray-500 transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
