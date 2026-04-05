import { useState } from "react";
import Header from "../../layouts/Dashboard/Header";
import Sidebar from "../../layouts/Dashboard/Sidebar";
import Stepper from "../../components/Stepper";

export default function SetNominal() {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  // In a real app this would come from router state / context (e.g. the selected contact from Transfer page)
  const selectedContact = {
    id: 1,
    name: "George Bluth",
    phone: "(239) 555-0108",
    img: "https://reqres.in/img/faces/1-image.jpg",
    verified: true,
  };

  const handleSubmit = () => {
    if (!amount) return alert("Masukkan nominal transfer");
    // TODO: POST transfer to API
    alert(`Transfer Rp${amount} ke ${selectedContact.name} berhasil!`);
  };

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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </span>
              <h1 className="text-xl font-bold text-gray-800">Transfer Money</h1>
            </div>
            <Stepper currentStep={2} />
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 min-h-150">
            <h2 className="text-lg font-bold text-gray-800 mb-6">People Information</h2>

            {/* Contact Card */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-8">
              <img
                src={selectedContact.img}
                alt={selectedContact.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5";
                }}
              />
              <div>
                <p className="font-semibold text-gray-800">{selectedContact.name}</p>
                <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                {selectedContact.verified && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter Some Notes"
                rows={5}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Submit &amp; Transfer
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
