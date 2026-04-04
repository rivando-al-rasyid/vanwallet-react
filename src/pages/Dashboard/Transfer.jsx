import { useState } from "react";
import Navbar from "../../layouts/Navbar";
import Sidebar from "../../layouts/Sidebar";
import Stepper from "../../components/Stepper";
import SearchInput from "../../components/SearchInput";

// Mock data based on the image content
const contactData = [
  {
    id: 1,
    name: "Ghaluh 1",
    phone: "(239) 555-0108",
    img: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Ghaluh 2",
    phone: "(480) 555-0103",
    img: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "Ghaluh 3",
    phone: "(225) 555-0118",
    img: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: 4,
    name: "Ghaluh 4",
    phone: "(406) 555-0120",
    img: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: 5,
    name: "Ghaluh 5",
    phone: "(303) 555-0105",
    img: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: 6,
    name: "Ghaluh 6",
    phone: "(808) 555-0111",
    img: "https://i.pravatar.cc/150?u=6",
  },
  {
    id: 7,
    name: "Ghaluh 7",
    phone: "(671) 555-0110",
    img: "https://i.pravatar.cc/150?u=7",
  },
  {
    id: 8,
    name: "Ghaluh 8",
    phone: "(270) 555-0117",
    img: "https://i.pravatar.cc/150?u=8",
  },
];

export default function Transfer() {
  const [search, setSearch] = useState("");

  const filteredContacts = contactData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  return (
    <>
      <Navbar />
      <main className="flex">
        <Sidebar />
        <section className="flex-1 p-8 bg-gray-50 min-h-screen">
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

            {/* Stepper UI */}
            <Stepper currentStep={1} />
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 min-h-150">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Find People</h2>
                <p className="text-xs text-gray-400">
                  {filteredContacts.length} Result Found For{" "}
                  {search || "Ghaluh"}
                </p>
              </div>

              {/* Search Bar */}
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Contact List */}
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <tbody className="space-y-1">
                  {filteredContacts.map((contact, index) => (
                    <tr
                      key={contact.id}
                      className={`group cursor-pointer transition-colors hover:bg-blue-50 ${
                        index % 2 !== 0 ? "bg-gray-50/50" : "bg-white"
                      }`}
                    >
                      <td>
                        <img
                          src={contact.img}
                          alt={contact.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      </td>
                      {/* Contact Info Column */}
                      <td className="px-4 py-4 rounded-l-xl">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-gray-700">
                            {contact.name}
                          </span>
                        </div>
                      </td>

                      {/* Phone Column */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500 font-medium">
                          {contact.phone}
                        </span>
                      </td>

                      {/* Favorite Action Column */}
                      <td className="px-4 py-4 text-right rounded-r-xl">
                        <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
