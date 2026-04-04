export default function Badge({ type }) {
  const styles = {
    income: "bg-green-50 text-green-600 border border-green-200",
    expense: "bg-red-50 text-red-500 border border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[type]}`}
    >
      {type === "income" ? "↑" : "↓"}{" "}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}
