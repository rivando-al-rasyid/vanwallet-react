import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css"; // Required styles
import Stepper from "../../components/Stepper";
import { getUserById } from "../../utils/auth";

export default function SetNominal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchContact() {
      setLoading(true);
      setError("");
      try {
        const user = await getUserById(id);
        if (!user) throw new Error("Kontak tidak ditemukan.");
        setSelectedContact({
          id: user.id,
          name: user.name,
          phone: user.phone,
          img: user.avatar,
          verified: true,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, [id]);

  const onOpenModal = () => {
    if (!amount || amount <= 0)
      return alert("Masukkan nominal transfer yang valid");
    setOpen(true);
  };

  const onCloseModal = () => setOpen(false);

  const handleFinalTransfer = () => {
    // Logic for actual API call goes here
    console.log("Transferring:", { amount, notes, to: selectedContact.name });
    setOpen(false);
    // navigate('/success');
  };

  return (
    <>
      {/* Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 12H5M12 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
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
        <Stepper currentStep={2} />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 min-h-150">
        <h2 className="text-lg font-bold text-gray-800 mb-6">
          People Information
        </h2>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm">Mengambil data kontak...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-500 font-semibold text-sm">{error}</p>
            <button
              onClick={() => navigate("/dashboard/transfer")}
              className="text-xs text-blue-600 underline"
            >
              Kembali ke Transfer
            </button>
          </div>
        )}

        {!loading && !error && selectedContact && (
          <>
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
                <p className="font-semibold text-gray-800">
                  {selectedContact.name}
                </p>
                <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                {selectedContact.verified && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  Rp
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter Some Notes"
                rows={5}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition resize-none"
              />
            </div>

            <button
              onClick={onOpenModal}
              className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Continue
            </button>
          </>
        )}
      </div>

      {/* --- REACT RESPONSIVE MODAL --- */}
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        classNames={{
          modal: "rounded-2xl p-0 overflow-hidden max-w-md w-full",
          closeButton: "hover:bg-gray-100 rounded-full p-1 transition-colors",
        }}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Confirm Transfer
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Please review the details below before proceeding with the
            transaction.
          </p>

          <div className="space-y-4 bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Recipient</span>
              <span className="text-gray-800 font-semibold text-sm">
                {selectedContact?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Amount</span>
              <span className="text-blue-600 font-bold text-sm">
                Rp {Number(amount).toLocaleString("id-ID")}
              </span>
            </div>
            {notes && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-500 text-xs block mb-1">Notes</span>
                <p className="text-gray-700 text-sm italic">"{notes}"</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCloseModal}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalTransfer}
              className="flex-1 py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Confirm & Send
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
