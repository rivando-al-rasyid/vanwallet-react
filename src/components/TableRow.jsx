import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

export default function TableRow({
  items,
  remove = false,
  showActions = true,
  onDelete,
  onRowClick,
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
      if (onDelete) onDelete(id);
      else setRows((prev) => prev.filter((item) => item.id !== id));
    },
    [onDelete],
  );

  const displayRows = remove ? items : rows;

  return (
    <div className="flex min-w-0 flex-col">
      <div className="overflow-x-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
        <table className="w-full min-w-[42rem] border-separate border-spacing-y-2 text-sm sm:text-base">
          <tbody>
            {displayRows.map((contact) => (
              <tr
                key={contact.id}
                onClick={() => onRowClick?.(contact)}
                className={`group hover:bg-primary/10 rounded-2xl transition-all ${
                  onRowClick ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <td className="bg-base-100 group-hover:bg-primary/10 rounded-l-2xl py-2 pl-2 sm:py-3">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="h-9 w-9 rounded-xl object-cover sm:h-11 sm:w-11"
                  />
                </td>
                <td className="bg-base-100 text-base-content group-hover:bg-primary/10 max-w-56 px-2 py-2 text-xs font-bold sm:px-4 sm:py-3 sm:text-sm lg:text-base">
                  <span className="block truncate">{contact.name}</span>
                </td>
                <td className="bg-base-100 text-base-content/65 group-hover:bg-primary/10 max-w-72 px-2 py-2 text-xs font-medium sm:px-4 sm:py-3 sm:text-sm">
                  <span className="block truncate">
                    {contact.phone || contact.email || contact.note || "-"}
                  </span>
                </td>
                {contact.amount && (
                  <td className="bg-base-100 group-hover:bg-primary/10 px-2 py-2 sm:px-4 sm:py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
                        contact.type === "income"
                          ? "bg-success/10 text-success"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      {contact.type === "income" ? "+" : "-"} {contact.amount}
                    </span>
                  </td>
                )}
                {showActions && (
                  <td className="bg-base-100 group-hover:bg-primary/10 rounded-r-2xl px-2 py-2 text-right sm:px-4 sm:py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove
                          ? handleDelete(contact.id)
                          : toggleFavorite(contact.id);
                      }}
                      className={`transition-colors ${
                        remove
                          ? "text-error hover:text-error"
                          : contact.isFavorite
                            ? "text-warning hover:text-warning"
                            : "text-base-content/50 hover:text-warning"
                      }`}
                      aria-label={remove ? "Delete row" : "Toggle favorite"}
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
                )}
              </tr>
            ))}
            {displayRows.length === 0 && (
              <tr>
                <td
                  colSpan={showActions ? 5 : 4}
                  className="text-base-content/50 py-12 text-center text-xs sm:py-20 sm:text-sm"
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
