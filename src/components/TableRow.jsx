import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 7;

/**
 * A versatile table component for displaying contact or transaction lists.
 * @param {Object} props
 * @param {Array<Object>} props.items
 * @param {boolean} [props.remove=false]
 * @param {function(string|number): void} [props.onDelete]
 * @param {boolean} [props.paginate=false]
 * @param {function(Object): void} [props.onRowClick]
 */
export default function TableRow({
  items,
  remove = false,
  onDelete,
  paginate = false,
  onRowClick,
  pageParamKey = "page",
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState(() =>
    items.map((item) => ({ ...item, isFavorite: false })),
  );
  const currentPage = Math.max(
    1,
    Number.parseInt(searchParams.get(pageParamKey) || "1", 10) || 1,
  );

  // Sync rows and reset page when items prop changes
  useEffect(() => {
    if (remove) return;
    setRows(items.map((item) => ({ ...item, isFavorite: false })));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(pageParamKey, "1");
      return next;
    });
  }, [items, pageParamKey, remove, setSearchParams]);

  const toggleFavorite = useCallback((id) => {
    setRows((prev) =>
      [
        ...prev.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
        ),
      ].sort((a, b) => b.isFavorite - a.isFavorite),
    );
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (onDelete) {
        onDelete(id);
      } else {
        setRows((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [onDelete],
  );

  const sourceRows = remove ? items : rows;

  const { displayRows, totalPages } = useMemo(() => {
    const total = Math.max(1, Math.ceil(sourceRows.length / ITEMS_PER_PAGE));
    const display = paginate
      ? sourceRows.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE,
        )
      : sourceRows;
    return { displayRows: display, totalPages: total };
  }, [sourceRows, paginate, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1),
    [totalPages],
  );

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set(pageParamKey, page.toString());
          return next;
        });
      }
    },
    [pageParamKey, totalPages, setSearchParams],
  );

  const visibleCount =
    Math.min(currentPage * ITEMS_PER_PAGE, sourceRows.length) -
    (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <table className="w-full border-separate border-spacing-y-2 text-sm sm:text-base">
          <tbody>
            {displayRows.map((contact, index) => (
              <tr
                key={contact.id}
                onClick={() => onRowClick?.(contact)}
                className={`group transition-colors hover:bg-blue-50 ${
                  onRowClick ? "cursor-pointer" : "cursor-default"
                } ${index % 2 !== 0 ? "bg-gray-50/50" : "bg-white"}`}
              >
                <td className="py-2 sm:py-3 pl-1 sm:pl-2 rounded-l-lg sm:rounded-l-xl">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl object-cover"
                  />
                </td>

                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className="font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
                    {contact.name}
                  </span>
                </td>

                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    {contact.phone}
                  </span>
                </td>

                {contact.amount && (
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span className={`badge ${contact.type === "income" ? "badge-success" : "badge-danger"}`}>
                      {contact.type === "income" ? "+" : "-"}
                      {contact.amount}
                    </span>
                  </td>
                )}

                <td className="px-2 sm:px-4 py-2 sm:py-3 text-right rounded-r-lg sm:rounded-r-xl">
                  {remove ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(contact.id);
                      }}
                      className={`transition-colors ${
                        contact.isFavorite
                          ? "text-yellow-400 hover:text-yellow-500"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                      title={contact.isFavorite ? "Unpin" : "Pin to top"}
                    >
                      <FontAwesomeIcon
                        icon={contact.isFavorite ? faStarSolid : faStar}
                      />
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {displayRows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 sm:py-20 text-center text-gray-400 text-xs sm:text-sm"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {paginate && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 border-t border-gray-100">
          <span className="text-xs sm:text-sm text-gray-400">
            Show {visibleCount} of {sourceRows.length}
          </span>
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-nowrap"
            >
              Prev
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-nowrap"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
