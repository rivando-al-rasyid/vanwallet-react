import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

/**
 * A versatile table component for displaying contact or transaction lists.
 */
export default function TableRow({
  items,
  remove = false,
  onDelete,
  onRowClick,
}) {
  const [rows, setRows] = useState(() =>
    items.map((item) => ({ ...item, isFavorite: false })),
  );

  // Sync rows when items prop changes (only if not in 'remove' mode)
  useEffect(() => {
    if (remove) return;
    setRows(items.map((item) => ({ ...item, isFavorite: false })));
  }, [items, remove]);

  const toggleFavorite = useCallback((id) => {
    setRows((prev) =>
      [...prev]
        .map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
        )
        .sort((a, b) => b.isFavorite - a.isFavorite),
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

  const displayRows = remove ? items : rows;

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
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
                <td className="rounded-l-lg py-2 pl-1 sm:rounded-l-xl sm:py-3 sm:pl-2">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="h-8 w-8 rounded-lg object-cover sm:h-10 sm:w-10 sm:rounded-xl lg:h-11 lg:w-11"
                  />
                </td>

                <td className="px-2 py-2 text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm lg:text-base">
                  {contact.name}
                </td>

                <td className="px-2 py-2 text-xs font-medium text-gray-500 sm:px-4 sm:py-3 sm:text-sm">
                  {contact.phone}
                </td>

                {contact.amount && (
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    <span
                      className={`badge ${contact.type === "income" ? "badge-success" : "badge-danger"}`}
                    >
                      {contact.type === "income" ? "+" : "-"} {contact.amount}
                    </span>
                  </td>
                )}

                <td className="rounded-r-lg px-2 py-2 text-right sm:rounded-r-xl sm:px-4 sm:py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove
                        ? handleDelete(contact.id)
                        : toggleFavorite(contact.id);
                    }}
                    className={`transition-colors ${
                      remove
                        ? "text-red-400 hover:text-red-500"
                        : contact.isFavorite
                          ? "text-yellow-400 hover:text-yellow-500"
                          : "text-gray-300 hover:text-yellow-400"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        remove
                          ? faTrashCan
                          : contact.isFavorite
                            ? faStarSolid
                            : faStar
                      }
                    />
                  </button>
                </td>
              </tr>
            ))}

            {displayRows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-xs text-gray-400 sm:py-20 sm:text-sm"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
