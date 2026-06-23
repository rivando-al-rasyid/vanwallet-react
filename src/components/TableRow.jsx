import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

export default function TableRow({ items, remove = false, showActions = true, onDelete, onRowClick }) {
  const [rows, setRows] = useState(() => items.map((item) => ({ ...item, isFavorite: false })));

  useEffect(() => {
    if (remove) return;
    setRows(items.map((item) => ({ ...item, isFavorite: false })));
  }, [items, remove]);

  const toggleFavorite = useCallback((id) => {
    setRows((prev) =>
      [...prev]
        .map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
        .sort((a, b) => b.isFavorite - a.isFavorite),
    );
  }, []);

  const handleDelete = useCallback((id) => {
    if (onDelete) onDelete(id);
    else setRows((prev) => prev.filter((item) => item.id !== id));
  }, [onDelete]);

  const displayRows = remove ? items : rows;

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
        <table className="w-full border-separate border-spacing-y-2 text-sm sm:text-base">
          <tbody>
            {displayRows.map((contact) => (
              <tr
                key={contact.id}
                onClick={() => onRowClick?.(contact)}
                className={`group rounded-2xl transition-all hover:bg-primary/10 ${onRowClick ? "cursor-pointer" : "cursor-default"}`}
              >
                <td className="rounded-l-2xl bg-base-100 py-2 pl-2 group-hover:bg-primary/10 sm:py-3">
                  <img src={contact.img} alt={contact.name} className="h-9 w-9 rounded-xl object-cover sm:h-11 sm:w-11" />
                </td>
                <td className="bg-base-100 px-2 py-2 text-xs font-bold text-base-content group-hover:bg-primary/10 sm:px-4 sm:py-3 sm:text-sm lg:text-base">
                  {contact.name}
                </td>
                <td className="bg-base-100 px-2 py-2 text-xs font-medium text-base-content/65 group-hover:bg-primary/10 sm:px-4 sm:py-3 sm:text-sm">
                  {contact.phone || contact.email || contact.note || "-"}
                </td>
                {contact.amount && (
                  <td className="bg-base-100 px-2 py-2 group-hover:bg-primary/10 sm:px-4 sm:py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${contact.type === "income" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                      {contact.type === "income" ? "+" : "-"} {contact.amount}
                    </span>
                  </td>
                )}
                {showActions && (
                  <td className="rounded-r-2xl bg-base-100 px-2 py-2 text-right group-hover:bg-primary/10 sm:px-4 sm:py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove ? handleDelete(contact.id) : toggleFavorite(contact.id);
                      }}
                      className={`transition-colors ${
                        remove
                          ? "text-error hover:text-error"
                          : contact.isFavorite
                            ? "text-warning hover:text-warning"
                            : "text-base-content/50 hover:text-warning"
                      }`}
                    >
                      <FontAwesomeIcon icon={remove ? faTrashCan : contact.isFavorite ? faStarSolid : faStar} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {displayRows.length === 0 && (
              <tr>
                <td colSpan={showActions ? 5 : 4} className="py-12 text-center text-xs text-base-content/50 sm:py-20 sm:text-sm">
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
