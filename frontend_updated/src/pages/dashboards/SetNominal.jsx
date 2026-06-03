/**
 * SetNominal.jsx
 *
 * Step 2 of the Transfer flow.
 * Receives selected contact from route state, collects amount + note,
 * then navigates to TransferModal for PIN confirmation before
 * calling POST /transactions/transfer.
 */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Stepper from "../../components/Stepper";
import { formatRupiah } from "../../utils/api";

export default function SetNominal() {
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state?.contact;

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!contact) {
    navigate("/dashboard/transfer", { replace: true });
    return null;
  }

  const handleSubmit = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError("Masukkan nominal transfer yang valid.");
      return;
    }
    setError("");
    navigate(`/dashboard/transfer/${contact.walletId}/confirm`, {
      state: { contact, amount: parsed, note },
    });
  };

  return (
    <>
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </span>
          <h1 className="section-title">Transfer Money</h1>
        </div>
        <Stepper currentStep={2} />
      </div>

      <div className="card">
        <h2 className="section-title mb-6">Transfer Detail</h2>

        {/* Recipient Info */}
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <img
            src={contact.img}
            alt={contact.name}
            className="h-12 w-12 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5";
            }}
          />
          <div>
            <p className="font-semibold text-gray-800">{contact.name}</p>
            <p className="text-sm text-gray-500">{contact.phone || contact.email}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="Enter transfer amount"
            className="form-input"
            min="1"
          />
          {amount && parseFloat(amount) > 0 && (
            <p className="mt-1 text-xs text-gray-400">
              {formatRupiah(parseFloat(amount))}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Note <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="form-input"
          />
        </div>

        {error && (
          <p className="mb-4 text-sm font-medium text-red-500">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard/transfer")}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Back
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1">
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
