import { useState } from "react";
import Navbar from "../../layouts/Dashboard/Header";
import Sidebar from "../../layouts/Dashboard/Sidebar";
import TableRow from "../../components/TableRow";

const ITEMS_PER_PAGE = 7;

const historyData = [
  {
    id: 1,
    img: "https://i.pravatar.cc/150?u=1",
    name: "Ghaluh 1",
    phone: "082116304337",
    amount: "Rp.50.000",
    type: "income",
  },
  {
    id: 2,
    img: "https://i.pravatar.cc/150?u=2",
    name: "Cameron Williamson",
    phone: "(308) 555-0121",
    amount: "Rp.50.000",
    type: "expense",
  },
  {
    id: 3,
    img: "https://i.pravatar.cc/150?u=3",
    name: "Cody Fisher",
    phone: "(704) 555-0127",
    amount: "Rp.50.000",
    type: "income",
  },
  {
    id: 4,
    img: "https://i.pravatar.cc/150?u=4",
    name: "Kristin Watson",
    phone: "(603) 555-0123",
    amount: "Rp.50.000",
    type: "expense",
  },
  {
    id: 5,
    img: "https://i.pravatar.cc/150?u=5",
    name: "Floyd Miles",
    phone: "(671) 555-0110",
    amount: "Rp.50.000",
    type: "income",
  },
  {
    id: 6,
    img: "https://i.pravatar.cc/150?u=6",
    name: "Wade Warren",
    phone: "(225) 555-0118",
    amount: "Rp.50.000",
    type: "expense",
  },
  {
    id: 7,
    img: "https://i.pravatar.cc/150?u=7",
    name: "Savannah Nguyen",
    phone: "(217) 555-0113",
    amount: "Rp.50.000",
    type: "income",
  },
  {
    id: 8,
    img: "https://i.pravatar.cc/150?u=8",
    name: "Jerome Bell",
    phone: "(302) 555-0107",
    amount: "Rp.75.000",
    type: "expense",
  },
  {
    id: 9,
    img: "https://i.pravatar.cc/150?u=9",
    name: "Annette Lewis",
    phone: "(406) 555-0120",
    amount: "Rp.75.000",
    type: "income",
  },
  {
    id: 10,
    img: "https://i.pravatar.cc/150?u=10",
    name: "Marvin Park",
    phone: "(505) 555-0125",
    amount: "Rp.100.000",
    type: "expense",
  },
  {
    id: 11,
    img: "https://i.pravatar.cc/150?u=11",
    name: "Ralph Scott",
    phone: "(907) 555-0101",
    amount: "Rp.25.000",
    type: "income",
  },
  {
    id: 12,
    img: "https://i.pravatar.cc/150?u=12",
    name: "Theresa Kim",
    phone: "(212) 555-0199",
    amount: "Rp.50.000",
    type: "expense",
  },
  {
    id: 13,
    img: "https://i.pravatar.cc/150?u=13",
    name: "Brooklyn Nash",
    phone: "(313) 555-0142",
    amount: "Rp.60.000",
    type: "income",
  },
  {
    id: 14,
    img: "https://i.pravatar.cc/150?u=14",
    name: "Leslie Ortiz",
    phone: "(404) 555-0167",
    amount: "Rp.50.000",
    type: "expense",
  },
  {
    id: 15,
    img: "https://i.pravatar.cc/150?u=15",
    name: "Philip Reed",
    phone: "(619) 555-0134",
    amount: "Rp.80.000",
    type: "income",
  },
];
// --- UPDATED AVATAR COMPONENT ---
function Avatar({ src, name }) {
  // Replace this URL with your desired default placeholder image
  const defaultPlaceholder =
    "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5";

  return (
    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
      <img
        src={src || defaultPlaceholder}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = defaultPlaceholder;
        }}
      />
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.25 5.25L3.75 5.25001"
        stroke="#D00000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 9.75V15.75"
        stroke="#D00000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 9.75V15.75"
        stroke="#D00000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 5.25V19.5C18.75 19.6989 18.671 19.8897 18.5303 20.0303C18.3897 20.171 18.1989 20.25 18 20.25H6C5.80109 20.25 5.61032 20.171 5.46967 20.0303C5.32902 19.8897 5.25 19.6989 5.25 19.5V5.25"
        stroke="#D00000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 5.25V3.75C15.75 3.35218 15.592 2.97064 15.3107 2.68934C15.0294 2.40804 14.6478 2.25 14.25 2.25H9.75C9.35218 2.25 8.97064 2.40804 8.68934 2.68934C8.40804 2.97064 8.25 3.35218 8.25 3.75V5.25"
        stroke="#D00000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
  );
}

export default function History() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(historyData);

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
      <Navbar />
      <main className="flex">
        <Sidebar />
        <section className="flex-1 flex flex-col gap-6 p-8 bg-gray-50 min-h-screen overflow-auto">
          {/* Page Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <HistoryIcon />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              History Transaction
            </h1>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm min-h-150">
            {/* Card Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">
                Find Transaction
              </h2>

              {/* Search Input */}
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchIcon />
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

            {/* Transaction Rows */}

            <div className="flex flex-col">
              {paginated.length > 0 ? (
                <TableRow items={paginated} remove={true} />
              ) : (
                <div className="py-20 text-center text-gray-400 text-sm">
                  No transactions found.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
              <span className="text-sm text-gray-400">
                Show {Math.min(ITEMS_PER_PAGE, filtered.length)} History of{" "}
                {filtered.length} History
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
          </div>
        </section>
      </main>
    </>
  );
}
