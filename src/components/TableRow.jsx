import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";

/**
 * A versatile table component for displaying contact or transaction lists.
 *
 * @param {object}    props
 * @param {Array}     props.items      - List of contacts or transactions to display
 * @param {boolean}   [props.remove]   - If true, shows delete button instead of favorite star
 * @param {Function}  [props.onDelete] - Called with item.id when delete is clicked (remove mode)
 * @param {Function}  [props.onRowClick] - Called with the item when a row is clicked
 */
export default function TableRow({ items, remove = false, onDelete, onRowClick }) {
  const [rows, setRows] = useState(() =>
    items.map((item) => ({ ...item, isFavorite: false })),
  );

  // Sync rows when items prop changes (only in non-remove mode)
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
                {/* Avatar */}
                <td className="rounded-l-lg py-2 pl-1 sm:rounded-l-xl sm:py-3 sm:pl-2">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="h-8 w-8 rounded-lg object-cover sm:h-10 sm:w-10 sm:rounded-xl lg:h-11 lg:w-11"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || "User")}&background=EBF4FF&color=7F9CF5`;
                    }}
                  />
                </td>

                {/* Name */}
                <td className="px-2 py-2 text-xs font-semibold text-gray-700 sm:px-4 sm:py-3 sm:text-sm lg:text-base">
                  {contact.name}
                </td>

                {/* Phone / label */}
                <td className="px-2 py-2 text-xs font-medium text-gray-500 sm:px-4 sm:py-3 sm:text-sm">
                  {contact.phone}
                </td>

                {/* Amount badge (transaction rows only) */}
                {contact.amount && (
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    <span
                      className={`badge ${contact.type === "income" ? "badge-success" : "badge-danger"}`}
                    >
                      {contact.type === "income" ? "+" : "-"} {contact.amount}
                    </span>
                  </td>
                )}

                {/* Action button */}
                <td className="rounded-r-lg px-2 py-2 text-right sm:rounded-r-xl sm:px-4 sm:py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove ? handleDelete(contact.id) : toggleFavorite(contact.id);
                    }}
                    className={`transition-colors ${
                      remove
                        ? "text-red-400 hover:text-red-500"
                        : contact.isFavorite
                          ? "text-yellow-400 hover:text-yellow-500"
                          : "text-gray-300 hover:text-yellow-400"
                    }`}
                    aria-label={remove ? "Remove contact" : contact.isFavorite ? "Unfavorite" : "Favorite"}
                  >
                    {remove ? (
                      <Icon icon="lucide:trash-2" width={16} height={16} />
                    ) : contact.isFavorite ? (
                      <Icon icon="lucide:star" width={16} height={16} className="fill-current" />
                    ) : (
                      <Icon icon="lucide:star" width={16} height={16} />
                    )}
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
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
