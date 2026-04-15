import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import TableRow from "../../components/TableRow";
import SearchInput from "../../components/SearchInput";
import { Pagination } from "../../components/Pagination";
import { getUsers } from "../../utils/auth";

const ITEMS_PER_PAGE = 7;

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
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");
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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSearchChange = (e) => {
    const nextSearch = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextSearch) {
        next.set("search", nextSearch);
      } else {
        next.delete("search");
      }
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
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
        <h1 className="section-title">History Transaction</h1>
      </div>

      {/* Main Card */}
      <div className="card min-h-150">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-100">
          <h2 className="section-title order-2 sm:order-1">
            Find Transaction
          </h2>
          <div className="order-1 sm:order-2">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Name or Number"
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
          <>
            <div className="overflow-x-auto">
              <TableRow
                items={paginated}
                remove={true}
                onDelete={handleDelete}
              />
            </div>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              visibleCount={paginated.length}
              totalItems={filtered.length}
            />
          </>
        )}
      </div>
    </>
  );
}
