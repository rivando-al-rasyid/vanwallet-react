import { useState } from "react";
import Header from "../../layouts/Dashboard/Header";
import Sidebar from "../../layouts/Dashboard/Sidebar";
import Stepper from "../../components/Stepper";

export default function SetNominal() {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const selectedContact = {
    id: 1,
    name: "George Bluth",
    phone: "(239) 555-0108",
    img: "https://reqres.in/img/faces/1-image.jpg",
    verified: true,
  };

  return (
    <>
      <Header />
      <Sidebar />

      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Transfer Money</h1>

        <Stepper
          steps={["Find People", "Set Nominal", "Finish"]}
          currentStep={2}
        />

        <section className="bg-white rounded-xl p-6 mt-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">People Information</h2>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={selectedContact.img}
                alt={selectedContact.name}
                className="w-14 h-14 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5";
                }}
              />
              <div>
                <p className="font-semibold">{selectedContact.name}</p>
                <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                {selectedContact.verified && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Nominal Transfer"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter Some Notes"
              rows={6}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium">
            Submit & Transfer
          </button>
        </section>
      </main>
    </>
  );
}
