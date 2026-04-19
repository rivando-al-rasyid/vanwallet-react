import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "../../components/SearchInput";
import { Pagination } from "../../components/Pagination";
import { fetchAllHistory } from "../../store/slices/historySlice";

const ITEMS_PER_PAGE = 6;

const TYPE_STYLE = {
  deposit: { label: "Deposit", badge: "badge-success", sign: "+" },
  withdrawal: { label: "Withdrawal", badge: "badge-danger", sign: "-" },
  payment: { label: "Payment", badge: "badge-danger", sign: "-" },
  invoice: { label: "Invoice", badge: "badge-warning", sign: "" },
};

export default function History() {
  const dispatch = useDispatch();
  const { history, status, error } = useSelector((state) => state.history);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllHistory());
    }
  }, [dispatch, status]);

  const filtered = history.filter(
    (item) =>
      item.transactionDesc.toLowerCase().includes(search.toLowerCase()) ||
      item.transactionType.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const loading = status === "loading";

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
          <h2 className="section-title order-2 sm:order-1">Find Transaction</h2>
          <div className="order-1 sm:order-2">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Type or Description"
            />
          </div>
        </div>

        {/* Loading */}
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
            <span className="text-xs sm:text-sm">Mengambil data history...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-500 font-semibold text-sm">{error}</p>
            <button
              onClick={() => dispatch(fetchAllHistory())}
              className="text-xs text-blue-600 underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
              <table className="w-full border-separate border-spacing-y-2 text-sm sm:text-base">
                <tbody>
                  {paginated.map((item, index) => {
                    const meta = TYPE_STYLE[item.transactionType] || {
                      label: item.transactionType,
                      badge: "badge-warning",
                      sign: "",
                    };
                    return (
                      <tr
                        key={item.id}
                        className={`group transition-colors hover:bg-blue-50 ${
                          index % 2 !== 0 ? "bg-gray-50/50" : "bg-white"
                        }`}
                      >
                        {/* Icon */}
                        <td className="py-2 sm:py-3 pl-1 sm:pl-2 rounded-l-lg sm:rounded-l-xl w-10 sm:w-12">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M3 10H21M7 3H17C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3Z"
                                stroke="#2563EB"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-2 sm:px-4 py-2 sm:py-3 max-w-xs lg:max-w-md">
                          <p className="font-semibold text-gray-700 text-xs sm:text-sm truncate">
                            {item.transactionDesc}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {formatDate(item.createdAt)}
                          </p>
                        </td>

                        {/* Type Badge */}
                        <td className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                          <span className={`badge ${meta.badge}`}>
                            {meta.label}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-right rounded-r-lg sm:rounded-r-xl">
                          <span
                            className={`font-semibold text-xs sm:text-sm ${
                              item.transactionType === "deposit"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {meta.sign} {formatAmount(item.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {paginated.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 sm:py-20 text-center text-gray-400 text-xs sm:text-sm"
                      >
                        No transaction found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
