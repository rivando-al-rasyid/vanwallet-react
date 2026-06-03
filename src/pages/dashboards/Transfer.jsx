import { useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Stepper from "../../components/Stepper";
import SearchInput from "../../components/SearchInput";
import TableRow from "../../components/TableRow";
import { Pagination } from "../../components/Pagination";
import { searchReceivers } from "../../store/slices/transactionSlice";

const ITEMS_PER_PAGE = 6;

export default function Transfer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");

  const { items: contacts, total, status, error } = useSelector(
    (state) => state.transaction.receivers,
  );

  const loading = status === "loading";

  const fetchContacts = useCallback(() => {
    dispatch(
      searchReceivers({
        q: search.trim(),
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [currentPage, dispatch, search]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const handleSearchChange = useCallback(
    (e) => {
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
    },
    [setSearchParams],
  );

  const handlePageChange = useCallback(
    (page) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(page));
        return next;
      });
    },
    [setSearchParams],
  );

  const handleRowClick = useCallback(
    (contact) => {
      navigate(`/dashboard/transfer/${contact.walletId}`, {
        state: { contact },
      });
    },
    [navigate],
  );

  const resultsText = useMemo(() => {
    if (loading) return "Memuat kontak...";
    const baseText = `${total} User Found`;
    return search ? `${baseText} For "${search}"` : baseText;
  }, [loading, search, total]);

  return (
    <>
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-blue-600">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </span>
          <h1 className="section-title">Transfer Money</h1>
        </div>
        <Stepper currentStep={1} />
      </div>

      <div className="card min-h-150">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="section-title">Find People</h2>
            <p className="text-xs text-gray-400">{resultsText}</p>
          </div>
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, email, phone"
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
            <svg
              className="h-8 w-8 animate-spin text-blue-500"
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
            <span className="text-sm">Mengambil data kontak...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <p className="text-sm font-semibold text-red-500">{error}</p>
            <button
              onClick={fetchContacts}
              className="text-xs text-blue-600 underline hover:text-blue-700"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <TableRow items={contacts} onRowClick={handleRowClick} />
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              visibleCount={contacts.length}
              totalItems={total}
              itemLabel="User"
            />
          </>
        )}
      </div>
    </>
  );
}
