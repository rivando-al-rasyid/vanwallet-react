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
      <div className="flex flex-col gap-3 border-t border-base-300 px-4 py-4 text-xs text-base-content/65 sm:flex-row sm:items-center sm:justify-between sm:text-sm lg:px-8">
        <span>Show {visibleCount} {itemLabel} of {totalItems} {itemLabel}</span>
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

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  const buttonBaseClass = "rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors sm:text-sm";

  return (
    <div className="flex flex-col gap-3 border-t border-base-300 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:px-8">
      <span className="text-xs text-base-content/65 sm:text-sm">Show {visibleCount} {itemLabel} of {totalItems} {itemLabel}</span>
      <div className="flex items-center justify-start gap-1 overflow-x-auto text-base-content/65 sm:justify-end">
        <button type="button" onClick={() => onPageChange(safeCurrentPage - 1)} disabled={safeCurrentPage === 1} className={`${buttonBaseClass} hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:text-base-content/50 disabled:hover:bg-transparent`}>
          Prev
        </button>
        {startPage > 1 && (
          <>
            <button type="button" onClick={() => onPageChange(1)} className={`${buttonBaseClass} hover:bg-primary/10 hover:text-primary`}>1</button>
            {startPage > 2 && <span className="px-1 text-base-content/50">...</span>}
          </>
        )}
        {pageNumbers.map((page) => {
          const isActive = safeCurrentPage === page;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`${buttonBaseClass} ${isActive ? "bg-primary text-primary-content shadow-sm" : "text-base-content/65 hover:bg-primary/10 hover:text-primary"}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
        {endPage < safeTotalPages && (
          <>
            {endPage < safeTotalPages - 1 && <span className="px-1 text-base-content/50">...</span>}
            <button type="button" onClick={() => onPageChange(safeTotalPages)} className={`${buttonBaseClass} hover:bg-primary/10 hover:text-primary`}>{safeTotalPages}</button>
          </>
        )}
        <button type="button" onClick={() => onPageChange(safeCurrentPage + 1)} disabled={safeCurrentPage === safeTotalPages} className={`${buttonBaseClass} hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:text-base-content/50 disabled:hover:bg-transparent`}>
          Next
        </button>
      </div>
    </div>
  );
}
