import { useState, useEffect } from "react";
import Header from "../../layouts/Dashboard/Header";
import Sidebar from "../../layouts/Dashboard/Sidebar";
import TableRow from "../../components/TableRow";
import { getUsers } from "../../services/auth";

const ITEMS_PER_PAGE = 7;

// Hardcoded transaction metadata — amount & type cycled per user
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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
          // cycle through hardcodedMeta if users exceed meta length
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = Math.min(totalPages, 9);
    for (let i = 1; i <= max; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      <Header />
      <main className="flex pt-16 min-h-screen">
        <Sidebar />
        <section className="flex-1 flex flex-col gap-6 p-8 overflow-auto">
          {/* Page Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L14.5 14.5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.07183 10.9999C5.55612 9.21564 6.62741 7.64082 8.11101 6.52659C9.59461 5.41236 11.4065 4.82128 13.2618 4.84455C15.1171 4.86782 16.9133 5.50418 18.3677 6.65488C19.8221 7.80559 20.8528 9.40555 21.2932 11.2019C21.7336 12.9982 21.5584 14.8905 20.7949 16.5757C20.0314 18.2608 18.7232 19.6435 17.0777 20.5031C15.4323 21.3627 13.5468 21.6497 11.7186 21.3185C9.89037 20.9872 8.22449 20.0567 6.99998 18.6799" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 9H7V4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">History Transaction</h1>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm min-h-150">
            {/* Card Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Find Transaction</h2>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Enter Number Or Full Name"
                  className="w-72 pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-sm">Mengambil data history...</span>
              </div>
            )}

            {/* Error */}
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

            {/* Transaction Rows */}
            {!loading && !error && (
              <div className="flex flex-col">
                {paginated.length > 0 ? (
                  <TableRow
                    items={paginated}
                    remove={true}
                    onDelete={handleDelete}
                  />
                ) : (
                  <div className="py-20 text-center text-gray-400 text-sm">
                    No transactions found.
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && (
              <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
                <span className="text-sm text-gray-400">
                  Show {Math.min(ITEMS_PER_PAGE, filtered.length)} History of {filtered.length} History
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 text-sm font-medium rounded-full transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
