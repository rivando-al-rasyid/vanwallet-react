import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import TableRow from "../../components/TableRow";
import { getUsers } from "../../utils/auth";

const hardcodedMeta = [
  { amount: "Rp.50.000", type: "income" },
  { amount: "Rp.50.000", type: "expense" },
  { amount: "Rp.75.000", type: "income" },
  { amount: "Rp.50.000", type: "expense" },
  { amount: "Rp.100.000", type: "income" },
  { amount: "Rp.25.000", type: "expense" },
  { amount: "Rp.60.000", type: "income" },
  { amount: "Rp.80.000", type: "expense" },
  { amount: "Rp.50.000", type: "income" },
  { amount: "Rp.75.000", type: "expense" },
];

export default function History() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError("");
      try {
        const users = await getUsers();
        const mapped = users.map((u, index) => ({
          id: u.id,
          img: u.avatar,
          name: u.name,
          phone: u.phone,
          amount: hardcodedMeta[index % hardcodedMeta.length].amount,
          type: hardcodedMeta[index % hardcodedMeta.length].type,
        }));
        setData(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search),
  );

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="sm:w-5 sm:h-5"
          >
            <path
              d="M12 8V12L14.5 14.5"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.07183 10.9999C5.55612 9.21564 6.62741 7.64082 8.11101 6.52659C9.59461 5.41236 11.4065 4.82128 13.2618 4.84455C15.1171 4.86782 16.9133 5.50418 18.3677 6.65488C19.8221 7.80559 20.8528 9.40555 21.2932 11.2019C21.7336 12.9982 21.5584 14.8905 20.7949 16.5757C20.0314 18.2608 18.7232 19.6435 17.0777 20.5031C15.4323 21.3627 13.5468 21.6497 11.7186 21.3185C9.89037 20.9872 8.22449 20.0567 6.99998 18.6799"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M2 9H7V4"
              stroke="#2563EB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          History Transaction
        </h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm min-h-150">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-100">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 order-2 sm:order-1">
            Find Transaction
          </h2>
          <div className="relative order-1 sm:order-2 w-full sm:w-auto">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              type="text"
              defaultValue={search}
              onChange={(e) => {
                const newSearch = e.target.value;
                const newParams = new URLSearchParams(searchParams);
                if (newSearch) {
                  newParams.set("search", newSearch);
                } else {
                  newParams.delete("search");
                }
                newParams.set("page", "1");
                window.history.pushState({}, "", `?${newParams.toString()}`);
              }}
              placeholder="Name or Number"
              className="w-full sm:w-72 pl-4 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
            />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 gap-3 text-gray-400">
            <svg
              className="animate-spin w-6 h-6 sm:w-8 sm:h-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span className="text-xs sm:text-sm">
              Mengambil data history...
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-500 font-semibold text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-600 underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <TableRow
              items={filtered}
              remove={true}
              onDelete={handleDelete}
              paginate={true}
            />
          </div>
        )}
      </div>
    </>
  );
}
