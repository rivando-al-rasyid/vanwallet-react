import { useSearchParams } from "react-router";

/**
 * useTransactionFilter
 *
 * Applies search and pagination to a transactions array.
 * Reads/writes ?search and ?page from the URL via useSearchParams.
 *
 * @param {Array}  transactions  - normalized transaction array from useTransactionHistory
 * @param {number} itemsPerPage  - how many rows per page (default 6)
 *
 * Returns:
 *   paginated       — sliced array for current page
 *   filtered        — full filtered array (before pagination)
 *   search          — current search string
 *   currentPage     — current page number (1-based)
 *   totalPages      — total page count
 *   handleSearch    — onChange handler for search input
 *   handlePageChange — (page: number) => void
 */
export function useTransactionFilter(transactions, itemsPerPage = 6) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || "1");

  const filtered = transactions.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.transactionDesc?.toLowerCase().includes(q) ||
      item.transactionType?.toLowerCase().includes(q) ||
      item.name?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const paginated = filtered.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("search", value);
      else next.delete("search");
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

  return {
    paginated,
    filtered,
    search,
    currentPage: safePage,
    totalPages,
    handleSearch,
    handlePageChange,
  };
}
