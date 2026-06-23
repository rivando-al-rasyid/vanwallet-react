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
          <span className="text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </span>
          <h1 className="text-lg font-black text-base-content">Transfer Money</h1>
        </div>
        <Stepper currentStep={2} />
      </div>

      <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-black text-base-content mb-6">Transfer Detail</h2>

        {/* Recipient Info */}
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-base-200 p-4">
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
            <p className="font-semibold text-base-content">{contact.name}</p>
            <p className="text-sm text-base-content/65">{contact.phone || contact.email}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-base-content/80">
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
            className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content shadow-sm outline-none transition placeholder:text-base-content/50 focus:border-primary focus:ring-4 focus:ring-primary/20"
            min="1"
          />
          {amount && parseFloat(amount) > 0 && (
            <p className="mt-1 text-xs text-base-content/50">
              {formatRupiah(parseFloat(amount))}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-base-content/80">
            Note <span className="font-normal text-base-content/50">(optional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content shadow-sm outline-none transition placeholder:text-base-content/50 focus:border-primary focus:ring-4 focus:ring-primary/20"
          />
        </div>

        {error && (
          <p className="mb-4 text-sm font-medium text-error">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard/transfer")}
            className="flex-1 rounded-xl border border-base-300 py-3 text-sm font-semibold text-base-content/75 transition hover:bg-base-200"
          >
            Back
          </button>
          <button onClick={handleSubmit} className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:from-primary/90 hover:to-secondary/90 disabled:opacity-60 flex-1">
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
