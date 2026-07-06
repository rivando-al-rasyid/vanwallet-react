export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  visibleCount,
  totalItems,
  itemLabel = "Item",
}) {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeCurrentPage = Math.min(
    Math.max(Number(currentPage) || 1, 1),
    safeTotalPages,
  );

  if (safeTotalPages <= 1 && totalItems <= visibleCount) {
    return (
      <div className="border-base-300 text-base-content/65 flex flex-col gap-3 border-t px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm lg:px-8">
        <span className="break-words">
          Show {visibleCount} {itemLabel} of {totalItems} {itemLabel}
        </span>
      </div>
    );
  }

  const windowSize = 5;
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
    "shrink-0 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors sm:text-sm";

  return (
    <div className="border-base-300 flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-8">
      <span className="text-base-content/65 text-xs sm:text-sm">
        Show {visibleCount} {itemLabel} of {totalItems} {itemLabel}
      </span>
      <div className="text-base-content/65 -mx-1 flex max-w-full items-center justify-start gap-1 overflow-x-auto px-1 pb-1 sm:justify-end">
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className={`${buttonBaseClass} hover:bg-primary/10 hover:text-primary disabled:text-base-content/50 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
        >
          Prev
        </button>
        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className={`${buttonBaseClass} hover:bg-primary/10 hover:text-primary`}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-base-content/50 px-1">...</span>
            )}
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
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/65 hover:bg-primary/10 hover:text-primary"
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
              <span className="text-base-content/50 px-1">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(safeTotalPages)}
              className={`${buttonBaseClass} hover:bg-primary/10 hover:text-primary`}
            >
              {safeTotalPages}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className={`${buttonBaseClass} hover:bg-primary/10 hover:text-primary disabled:text-base-content/50 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
