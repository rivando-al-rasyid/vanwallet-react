import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import TableRow from "../../components/TableRow";
import SearchInput from "../../components/SearchInput";
import { Pagination } from "../../components/Pagination";
import { fetchHistory } from "../../utils/api";

const ITEMS_PER_PAGE = 6;

export default function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchHistory({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setData(result.items);
      setTotalItems(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filtered = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      String(item.phone || "").includes(search),
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginated = search ? filtered : data;

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
      <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="sm:h-5 sm:w-5"
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

      <div className="card min-h-150">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
          <h2 className="section-title order-2 sm:order-1">Find Transaction</h2>
          <div className="order-1 sm:order-2">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Name or Number"
            />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400 sm:py-20">
            <svg
              className="h-6 w-6 animate-spin text-blue-500 sm:h-8 sm:w-8"
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
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <p className="text-sm font-semibold text-red-500">{error}</p>
            <button
              onClick={loadHistory}
              className="text-xs text-blue-600 underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <TableRow items={paginated} remove={false} />
            </div>
            {!search && (
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                visibleCount={paginated.length}
                totalItems={totalItems}
              />
            )}
            {search && paginated.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-400">
                No matching transactions on this page.
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
