import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

export default function TableRow({ items, remove = false, onDelete }) {
  const [rows, setRows] = useState(
    items.map((item) => ({ ...item, isFavorite: false })),
  );

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

  const displayRows = remove ? items : rows;

  return (
    <div className="overflow-x-auto px-8 py-4">
      <table className="w-full border-separate border-spacing-y-2">
        <tbody>
          {displayRows.map((contact, index) => (
            <tr
              key={contact.id}
              className={`group cursor-pointer transition-colors hover:bg-blue-50 ${
                index % 2 !== 0 ? "bg-gray-50/50" : "bg-white"
              }`}
            >
              {/* Avatar */}
              <td className="py-3 pl-2 rounded-l-xl">
                <img
                  src={contact.img}
                  alt={contact.name}
                  className="w-11 h-11 rounded-xl object-cover"
                />
              </td>

              {/* Name Column */}
              <td className="px-4 py-3">
                <span className="font-semibold text-gray-700">
                  {contact.name}
                </span>
              </td>

              {/* Phone/Email Column */}
              <td className="px-4 py-3">
                <span className="text-sm text-gray-500 font-medium">
                  {contact.phone}
                </span>
              </td>

              {/* Amount Column — hanya tampil jika ada (History) */}
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

              {/* Favorite/Pin — tampil hanya jika remove = false */}
              {!remove && (
                <td className="px-4 py-3 text-right rounded-r-xl">
                  <button
                    onClick={() => toggleFavorite(contact.id)}
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

              {/* Trash — tampil hanya jika remove = true */}
              {remove && (
                <td className="px-4 py-3 text-right rounded-r-xl">
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-400 hover:text-red-500 transition-colors"
                    title="Hapus"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
