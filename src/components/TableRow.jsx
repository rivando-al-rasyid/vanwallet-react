import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";

/**
 * A versatile table component for displaying contact or transaction lists.
 *
 * Props:
 * - items: array of row data
 * - remove: boolean — show trash icon (delete mode)
 * - onDelete: callback(id) when delete is triggered
 * - onRowClick: callback(item) when row is clicked
 * - actionIcon: ReactNode — custom icon to render in action cell (overrides star/trash)
 * - onAction: callback(item) — fired when custom action button is clicked
 */
export default function TableRow({
  items,
  remove = false,
  onDelete,
  onRowClick,
  actionIcon,
  onAction,
}) {
  const [rows, setRows] = useState(() =>
    items.map((item) => ({ ...item, isFavorite: false })),
  );

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

  const renderActionButton = (contact) => {
    if (actionIcon !== undefined) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction?.(contact);
          }}
          className="text-gray-300 hover:text-blue-400 transition-colors"
        >
          {actionIcon}
        </button>
      );
    }

    return (
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
        aria-label={remove ? "Delete" : contact.isFavorite ? "Unfavorite" : "Favorite"}
      >
        {remove ? (
          <Icon icon="fa-regular:trash-can" width={16} height={16} />
        ) : contact.isFavorite ? (
          <Icon icon="fa-solid:star" width={16} height={16} />
        ) : (
          <Icon icon="fa-regular:star" width={16} height={16} />
        )}
      </button>
    );
  };

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
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl object-cover"
                  />
                </td>

                <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-xs sm:text-sm lg:text-base">
                  {contact.name}
                </td>

                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 font-medium">
                  {contact.phone}
                </td>

                {contact.amount && (
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <span
                      className={`badge ${contact.type === "income" ? "badge-success" : "badge-danger"}`}
                    >
                      {contact.type === "income" ? "+" : "-"} {contact.amount}
                    </span>
                  </td>
                )}

                <td className="px-2 sm:px-4 py-2 sm:py-3 text-right rounded-r-lg sm:rounded-r-xl">
                  {renderActionButton(contact)}
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
    </div>
  );
}
