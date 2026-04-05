import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../../layouts/Dashboard/Header";
import Sidebar from "../../layouts/Dashboard/Sidebar";
import Stepper from "../../components/Stepper";
import SearchInput from "../../components/SearchInput";
import TableRow from "../../components/TableRow";
import { getUsers } from "../../services/auth";

export default function Transfer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Header />
      <main className="flex pt-16 min-h-screen">
        <Sidebar />
        <section className="flex-1 flex flex-col gap-6 p-8 overflow-auto">
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
              <h1 className="text-xl font-bold text-gray-800">
                Transfer Money
              </h1>
            </div>
            <Stepper currentStep={1} />
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 min-h-150">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Find People</h2>
                <p className="text-xs text-gray-400">
                  {loading
                    ? "Memuat kontak..."
                    : `${filteredContacts.length} Result Found${search ? ` For "${search}"` : ""}`}
                </p>
              </div>
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Loading */}
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

            {/* Data — filteredContacts dikirim langsung agar search langsung reaktif */}
            {!loading && !error && (
              <TableRow
                items={filteredContacts}
                paginate={true}
                onRowClick={(contact) => navigate(`/transfer/${contact.id}`)}
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
