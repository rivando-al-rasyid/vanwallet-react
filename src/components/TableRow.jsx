import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

export default function TableRow({ items: initialItems, remove = false }) {
  const [items, setItems] = useState(
    initialItems.map((item) => ({ ...item, isFavorite: false })),
  );

  const toggleFavorite = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2">
        <tbody className="space-y-1">
          {items.map((contact, index) => (
            <tr
              key={contact.id}
              className={`group cursor-pointer transition-colors hover:bg-blue-50 ${
                index % 2 !== 0 ? "bg-gray-50/50" : "bg-white"
              }`}
            >
              {/* Avatar */}
              <td>
                <img
                  src={contact.img}
                  alt={contact.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              </td>

              {/* Contact Info Column */}
              <td className="px-4 py-4 rounded-l-xl">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-700">
                    {contact.name}
                  </span>
                </div>
              </td>

              {/* Phone Column */}
              <td className="px-4 py-4">
                <span className="text-sm text-gray-500 font-medium">
                  {contact.phone}
                </span>
              </td>

              {/* Favorite Action Column — tampil hanya jika remove = false */}
              {!remove && (
                <td className="px-4 py-4 text-right rounded-r-xl">
                  <button
                    onClick={() => toggleFavorite(contact.id)}
                    className={`transition-colors ${
                      contact.isFavorite
                        ? "text-yellow-400 hover:text-yellow-500"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                    title={contact.isFavorite ? "Unfavorite" : "Favorite"}
                  >
                    <FontAwesomeIcon
                      icon={contact.isFavorite ? faStarSolid : faStar}
                    />
                  </button>
                </td>
              )}

              {/* Trash Action Column — tampil hanya jika remove = true */}
              {remove && (
                <td className="px-4 py-4 text-right rounded-r-xl">
                  <button
                    onClick={() => deleteItem(contact.id)}
                    className="text-red-400 hover:text-red-500 transition-colors"
                    title="Hapus kontak"
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
