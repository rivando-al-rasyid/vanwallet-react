import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import TableRow from "../../components/TableRow";
import SearchInput from "../../components/SearchInput";
import { Pagination } from "../../components/Pagination";
import { fetchHistory } from "../../store/slices/transactionSlice";

const DEFAULT_LIMIT = 10;

function getPositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default function History() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = getPositiveNumber(searchParams.get("page"), 1);
  const limit = DEFAULT_LIMIT;
  const q = searchParams.get("q") || "";

  const { items, total, totalPages, status, error } = useSelector(
    (state) => state.transaction.history,
  );

  const loading = status === "loading";
  const safeTotalPages = Math.max(
    1,
    totalPages || Math.ceil(total / limit) || 1,
  );
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);

  const historyParams = useMemo(() => ({ page, limit, q }), [page, limit, q]);

  useEffect(() => {
    dispatch(fetchHistory(historyParams));
  }, [dispatch, historyParams]);

  const updateParam = (key, value, resetPage = true) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }

      if (resetPage) {
        next.set("page", "1");
      }

      return next;
    });
  };

  const handleSearchChange = (event) => {
    updateParam("q", event.target.value.trim());
  };

  const handlePageChange = (nextPage) => {
    updateParam("page", String(nextPage), false);
  };

  const handleRetry = () => {
    dispatch(fetchHistory(historyParams));
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:h-10 sm:w-10">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="sm:h-5 sm:w-5"
          >
            <path
              d="M12 8V12L14.5 14.5"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.07183 10.9999C5.55612 9.21564 6.62741 7.64082 8.11101 6.52659C9.59461 5.41236 11.4065 4.82128 13.2618 4.84455C15.1171 4.86782 16.9133 5.50418 18.3677 6.65488C19.8221 7.80559 20.8528 9.40555 21.2932 11.2019C21.7336 12.9982 21.5584 14.8905 20.7949 16.5757C20.0314 18.2608 18.7232 19.6435 17.0777 20.5031C15.4323 21.3627 13.5468 21.6497 11.7186 21.3185C9.89037 20.9872 8.22449 20.0567 6.99998 18.6799"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M2 9H7V4"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-lg font-black text-slate-950">History Transaction</h1>
      </div>

      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6 min-h-[37.5rem]">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-black text-slate-950">Find Transaction</h2>
            <SearchInput
              value={q}
              onChange={handleSearchChange}
              placeholder="Search title, note, wallet..."
            />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-400 sm:py-20">
            <svg
              className="h-6 w-6 animate-spin text-indigo-500 sm:h-8 sm:w-8"
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
            <p className="text-sm font-semibold text-rose-500">{error}</p>
            <button
              onClick={handleRetry}
              className="text-xs text-indigo-600 underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <TableRow items={items} remove={false} showActions={false} />
            </div>
            <Pagination
              currentPage={safePage}
              totalPages={safeTotalPages}
              onPageChange={handlePageChange}
              visibleCount={items.length}
              totalItems={total}
              itemLabel="History"
            />
          </>
        )}
      </div>
    </>
  );
}
