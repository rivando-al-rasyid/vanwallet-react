/**
 * A reusable pagination control component styled like the dashboard mockup.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  visibleCount,
  totalItems,
  itemLabel = "Item",
}) {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeCurrentPage = Math.min(Math.max(Number(currentPage) || 1, 1), safeTotalPages);

  if (safeTotalPages <= 1 && totalItems <= visibleCount) {
    return (
      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm lg:px-8">
        <span>
          Show {visibleCount} {itemLabel} of {totalItems} {itemLabel}
        </span>
      </div>
    );
  }

  const windowSize = 8;
  let startPage = Math.max(1, safeCurrentPage - Math.floor(windowSize / 2));
  let endPage = startPage + windowSize - 1;

  if (endPage > safeTotalPages) {
    endPage = safeTotalPages;
    startPage = Math.max(1, endPage - windowSize + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  const buttonBaseClass =
    "px-1.5 py-1 text-xs font-medium transition-colors sm:px-2 sm:text-sm";

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-8">
      <span className="text-xs text-slate-500 sm:text-sm">
        Show {visibleCount} {itemLabel} of {totalItems} {itemLabel}
      </span>

      <div className="flex items-center justify-start gap-1 overflow-x-auto text-slate-500 sm:justify-end">
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className={`${buttonBaseClass} text-slate-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300`}
        >
          Prev
        </button>

        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className={`${buttonBaseClass} hover:text-blue-600`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-slate-300">...</span>}
          </>
        )}

        {pageNumbers.map((page) => {
          const isActive = safeCurrentPage === page;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`${buttonBaseClass} ${
                isActive
                  ? "font-semibold text-blue-600"
                  : "text-slate-500 hover:text-blue-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}

        {endPage < safeTotalPages && (
          <>
            {endPage < safeTotalPages - 1 && (
              <span className="px-1 text-slate-300">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(safeTotalPages)}
              className={`${buttonBaseClass} hover:text-blue-600`}
            >
              {safeTotalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className={`${buttonBaseClass} text-slate-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
