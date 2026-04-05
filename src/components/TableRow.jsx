import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 7;

export default function TableRow({
  items,
  remove = false,
  onDelete,
  paginate = false,
  onRowClick,
}) {
  const [rows, setRows] = useState(
    items.map((item) => ({ ...item, isFavorite: false })),
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Sync rows when items prop changes (e.g. after delete or search)
  useEffect(() => {
    if (remove) return; // rows managed externally when remove=true
    setRows(items.map((item) => ({ ...item, isFavorite: false })));
    setCurrentPage(1);
  }, [items, remove]);

  // Reset page when items change (search filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const toggleFavorite = (id) => {
    setRows((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      );
      return [...updated].sort((a, b) => b.isFavorite - a.isFavorite);
    });
  };

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id);
    } else {
      setRows((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const sourceRows = remove ? items : rows;

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sourceRows.length / ITEMS_PER_PAGE));
  const displayRows = paginate
    ? sourceRows.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : sourceRows;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = Math.min(totalPages, 9);
    for (let i = 1; i <= max; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto px-8 py-4">
        <table className="w-full border-separate border-spacing-y-2">
          <tbody>
            {displayRows.map((contact, index) => (
              <tr
                key={contact.id}
                onClick={() => onRowClick && onRowClick(contact)}
                className={`group transition-colors hover:bg-blue-50 ${
                  onRowClick ? "cursor-pointer" : "cursor-default"
                } ${index % 2 !== 0 ? "bg-gray-50/50" : "bg-white"}`}
              >
                {/* Avatar */}
                <td className="py-3 pl-2 rounded-l-xl">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-700">
                    {contact.name}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500 font-medium">
                    {contact.phone}
                  </span>
                </td>

                {/* Amount — only shown if present (History) */}
                {contact.amount && (
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-semibold ${
                        contact.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {contact.type === "income" ? "+" : "-"}
                      {contact.amount}
                    </span>
                  </td>
                )}

                {/* Favorite — only when remove=false */}
                {!remove && (
                  <td className="px-4 py-3 text-right rounded-r-xl">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(contact.id); }}
                      className={`transition-colors ${
                        contact.isFavorite
                          ? "text-yellow-400 hover:text-yellow-500"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                      title={contact.isFavorite ? "Unpin" : "Pin ke atas"}
                    >
                      <FontAwesomeIcon
                        icon={contact.isFavorite ? faStarSolid : faStar}
                      />
                    </button>
                  </td>
                )}

                {/* Trash — only when remove=true */}
                {remove && (
                  <td className="px-4 py-3 text-right rounded-r-xl">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      title="Hapus"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {displayRows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-400 text-sm">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — only shown when paginate=true */}
      {paginate && (
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
          <span className="text-sm text-gray-400">
            Show{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, sourceRows.length) -
              (currentPage - 1) * ITEMS_PER_PAGE}{" "}
            of {sourceRows.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 text-sm font-medium rounded-full transition-colors ${
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
              className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
