import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Stepper from "../../components/Stepper";
import SearchInput from "../../components/SearchInput";
import TableRow from "../../components/TableRow";
import { Pagination } from "../../components/Pagination";
import { searchReceivers } from "../../utils/api";

const ITEMS_PER_PAGE = 6;

export default function Transfer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");

  const fetchContacts = useCallback(async () => {
    if (search.trim().length < 2) {
      setContacts([]);
      setTotalItems(0);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await searchReceivers({
        q: search.trim(),
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setContacts(result.items);
      setTotalItems(result.total);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
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

  const handleRetry = useCallback(() => {
    fetchContacts();
  }, [fetchContacts]);

  const resultsText = useMemo(() => {
    if (loading) return "Memuat kontak...";
    if (search.trim().length < 2) {
      return "Ketik minimal 2 karakter untuk mencari penerima";
    }
    const count = totalItems;
    const baseText = `${count} Result Found`;
    return search ? `${baseText} For "${search}"` : baseText;
  }, [loading, totalItems, search]);

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
            placeholder="Search by name or phone"
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
              onClick={handleRetry}
              className="text-xs text-blue-600 underline hover:text-blue-700"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && search.trim().length >= 2 && (
          <>
            <TableRow items={contacts} onRowClick={handleRowClick} />
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              visibleCount={contacts.length}
              totalItems={totalItems}
            />
          </>
        )}

        {!loading && !error && search.trim().length < 2 && (
          <div className="py-20 text-center text-sm text-slate-400">
            Search for a recipient by name or phone number.
          </div>
        )}
      </div>
    </>
  );
}
