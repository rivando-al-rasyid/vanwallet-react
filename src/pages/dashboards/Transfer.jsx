import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Stepper from "../../components/Stepper";
import SearchInput from "../../components/SearchInput";
import TableRow from "../../components/TableRow";
import { getUsers } from "../../utils/auth";

/**
 * @typedef {Object} Contact
 * @property {string|number} id - Contact ID
 * @property {string} name - Contact name
 * @property {string} phone - Contact phone number
 * @property {string} img - Contact avatar URL
 */

/**
 * Transfer page component for finding and selecting contacts to transfer money.
 */
export default function Transfer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState(/** @type {Contact[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";

  // Memoized fetch users function
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const users = await getUsers();
      const mapped = users.map((u) => ({
        id: u.id,
        name: u.name,
        phone: u.phone,
        img: u.avatar,
      }));
      setContacts(mapped);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoized filtered contacts
  const filteredContacts = useMemo(() => {
    if (!search.trim()) return contacts;

    const searchTerm = search.toLowerCase().trim();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.phone.toLowerCase().includes(searchTerm),
    );
  }, [contacts, search]);

  // Memoized search change handler
  const handleSearchChange = useCallback(
    (e) => {
      const newSearch = e.target.value.trim();
      const newParams = new URLSearchParams(searchParams);

      if (newSearch) {
        newParams.set("search", newSearch);
      } else {
        newParams.delete("search");
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  // Memoized row click handler
  const handleRowClick = useCallback(
    (contact) => {
      navigate(`/dashboard/transfer/${contact.id}`);
    },
    [navigate],
  );

  // Memoized retry handler
  const handleRetry = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoized results text
  const resultsText = useMemo(() => {
    if (loading) return "Memuat kontak...";
    const count = filteredContacts.length;
    const baseText = `${count} Result Found`;
    return search ? `${baseText} For "${search}"` : baseText;
  }, [loading, filteredContacts.length, search]);

  return (
    <>
      {/* Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
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
          <h1 className="text-xl font-bold text-gray-800">Transfer Money</h1>
        </div>
        <Stepper currentStep={1} />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 min-h-150">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Find People</h2>
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
            <svg
              className="animate-spin w-8 h-8 text-blue-500"
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
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-500 font-semibold text-sm">{error}</p>
            <button
              onClick={handleRetry}
              className="text-xs text-blue-600 underline hover:text-blue-700 transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <TableRow
            items={filteredContacts}
            paginate={true}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </>
  );
}
