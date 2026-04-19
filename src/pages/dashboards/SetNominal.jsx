// src/pages/transfer/SetNominal.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Stepper from "../../components/Stepper";
import { getUserById, verifyPin, transaction } from "../../utils/auth";
import TransferModal from "./TransferModal";
import Toast from "../../components/Toast";
import { useSelector, useDispatch } from "react-redux";
import { resetHistory } from "../../store/slices/historySlice";
import Joi from "joi";

export default function SetNominal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.profile.user);

  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
  });

  // "pin" | "failed" | "success" | null
  const [modalStep, setModalStep] = useState(null);

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

  const nominalSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
      "number.base": "Nominal harus berupa angka.",
      "number.positive": "Nominal transfer harus lebih dari 0.",
      "any.required": "Nominal wajib diisi.",
    }),
    notes: Joi.string().allow("").max(200).messages({
      "string.max": "Catatan maksimal 200 karakter.",
    }),
  });

  const handleOpenPinModal = () => {
    const { error: validationError } = nominalSchema.validate(
      { amount: parseFloat(amount) || undefined, notes },
      { abortEarly: true }
    );
    if (validationError) {
      setToast({
        open: true,
        message: validationError.message,
        type: "error",
      });
      return;
    }
    setModalStep("pin");
  };

  const handlePinSubmit = async (pin) => {
    try {
      await verifyPin(currentUser?.id, pin);

      const desc = `Transfer to ${selectedContact.name} (${selectedContact.phone})${notes ? `. Notes: ${notes}` : ""}`;
      await transaction({
        userId: currentUser?.id,
        transactionType: "payment",
        transactionDesc: desc,
        amount: parseFloat(amount),
      });

      // Reset history so it refetches fresh on next visit
      dispatch(resetHistory());

      setModalStep("success");
      setToast({
        open: true,
        message: "Transfer berhasil diproses.",
        type: "success",
      });
    } catch (err) {
      setModalStep("failed");
      setToast({
        open: true,
        message: err.message || "PIN tidak valid. Coba lagi.",
        type: "error",
      });
    }
  };

  const handleDone = () => {
    setModalStep(null);
    navigate("/dashboard");
  };

  const handleTryAgain = () => setModalStep("pin");

  const handleTransferAgain = () => {
    setModalStep(null);
    setAmount("");
    setNotes("");
    navigate("/dashboard/transfer");
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

          <h1 className="section-title">Transfer Money</h1>
        </div>
        <Stepper currentStep={2} />
      </div>

      {/* Main Content Card */}
      <div className="card min-h-150">
        <h2 className="section-title mb-6">
          People Information
        </h2>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
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
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {selectedContact.name}
                </p>
                <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                {selectedContact.verified && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <button className="text-gray-300 hover:text-yellow-400 transition-colors ml-auto shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Amount
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Type the amount you want to transfer and then press continue to
                the next steps.
              </p>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Nominal Transfer"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Notes
              </label>
              <p className="text-xs text-gray-400 mb-2">
                You can add some notes for this transfer such as payment coffee
                or something.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter Some Notes"
                rows={5}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition resize-none"
              />
            </div>

            <button
              onClick={handleOpenPinModal}
              className="btn-primary w-full"
            >
              Submit &amp; Transfer
            </button>
          </>
        )}
      </div>

      <TransferModal
        open={modalStep !== null}
        step={modalStep}
        onPinSubmit={handlePinSubmit}
        onDone={handleDone}
        onTryAgain={handleTryAgain}
        onTransferAgain={handleTransferAgain}
        toName={selectedContact?.name ?? ""}
      />
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
