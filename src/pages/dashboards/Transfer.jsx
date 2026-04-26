import { useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { fetchAllUsers } from "../../store/slices/transferSlice";
import Stepper from "../../components/Stepper";
import SearchInput from "../../components/SearchInput";
import TableRow from "../../components/TableRow";
import { Pagination } from "../../components/Pagination";

const ITEMS_PER_PAGE = 6;

export default function Transfer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { users, status, error } = useSelector((state) => state.transfer);
  const loading = status === "loading";

  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, status]);

  const filteredContacts = useMemo(() => {
    if (!search.trim()) return users;
    const searchTerm = search.toLowerCase().trim();
    return users.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.phone.toLowerCase().includes(searchTerm),
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);

  const paginatedContacts = useMemo(
    () =>
      filteredContacts.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE,
      ),
    [filteredContacts, safePage],
  );

  const handleSearchChange = useCallback(
    (e) => {
      const nextSearch = e.target.value;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (nextSearch) { next.set("search", nextSearch); } else { next.delete("search"); }
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
    (contact) => { navigate(`/dashboard/transfer/${contact.id}`); },
    [navigate],
  );

  const handleRetry = useCallback(() => { dispatch(fetchAllUsers()); }, [dispatch]);

  const resultsText = useMemo(() => {
    if (loading) return "Memuat kontak...";
    const count = filteredContacts.length;
    const baseText = `${count} Result Found`;
    return search ? `${baseText} For "${search}"` : baseText;
  }, [loading, filteredContacts.length, search]);

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-blue-600">
            <Icon icon="lucide:send" width={24} height={24} aria-hidden="true" />
          </span>
          <h1 className="section-title">Transfer Money</h1>
        </div>
        <Stepper currentStep={1} />
      </div>

      <div className="card min-h-150">
        <div className="flex justify-between items-center mb-6">
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
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <Icon
              icon="lucide:loader-circle"
              className="animate-spin w-8 h-8 text-blue-500"
              aria-hidden="true"
            />
            <span className="text-sm">Mengambil data kontak...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-500 font-semibold text-sm">{error}</p>
            <button
              onClick={handleRetry}
              className="text-xs text-blue-600 underline hover:text-blue-700"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <TableRow items={paginatedContacts} onRowClick={handleRowClick} />
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              visibleCount={paginatedContacts.length}
              totalItems={filteredContacts.length}
            />
          </>
        )}
      </div>
    </>
  );
}
