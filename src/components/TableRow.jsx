export default function TableRow({
  item,
  isOdd,
  onDelete,
  onToggleFavorite,
  onSelect,
  exiting,
}) {
  return (
    <tr
      className={`group border-b border-gray-100 last:border-0 transition-all duration-200 hover:bg-blue-50/40 ${
        isOdd ? "bg-gray-50/60" : "bg-white"
      } ${exiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
    >
      {/* Name */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar src={item.img} name={item.name} id={item.id} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {item.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              {item.phone}
            </p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-5 py-3">
        <Badge type={item.type} kind={item.kind} />
      </td>

      {/* Amount */}
      <td className="px-5 py-3 text-right">
        <span
          className={`text-sm font-bold font-mono ${
            item.type === "income" ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {item.type === "income" ? "+" : "−"} ${formatAmount(item.amount)}
        </span>
      </td>

      {/* Favorite */}
      <td className="px-5 py-3 text-center">
        <StarButton
          active={item.favorite}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
        />
      </td>

      {/* Actions */}
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-2">
          {item.kind === "contact" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              Select
            </button>
          )}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}
