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
      <div className="mb-6 sm:mb-8">
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <span className="text-primary">
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
          <h1 className="text-base-content text-lg font-black">
            Transfer Money
          </h1>
        </div>
        <Stepper currentStep={2} />
      </div>

      <div className="border-base-300 bg-base-100 min-w-0 rounded-[1.5rem] border p-4 shadow-sm sm:p-6">
        <h2 className="text-base-content mb-6 text-lg font-black">
          Transfer Detail
        </h2>

        {/* Recipient Info */}
        <div className="bg-base-200 mb-6 flex min-w-0 items-center gap-3 rounded-xl p-3 sm:p-4">
          <img
            src={contact.img}
            alt={contact.name}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5";
            }}
          />
          <div className="min-w-0">
            <p className="text-base-content truncate font-semibold">
              {contact.name}
            </p>
            <p className="text-base-content/65 truncate text-sm">
              {contact.phone || contact.email}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="text-base-content/80 mb-2 block text-sm font-semibold">
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
            className="border-base-300 bg-base-100 text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-primary/20 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm transition outline-none focus:ring-4"
            min="1"
          />
          {amount && parseFloat(amount) > 0 && (
            <p className="text-base-content/50 mt-1 text-xs">
              {formatRupiah(parseFloat(amount))}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="text-base-content/80 mb-2 block text-sm font-semibold">
            Note{" "}
            <span className="text-base-content/50 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="border-base-300 bg-base-100 text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-primary/20 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm transition outline-none focus:ring-4"
          />
        </div>

        {error && (
          <p className="text-error mb-4 text-sm font-medium">{error}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/dashboard/transfer")}
            className="border-base-300 text-base-content/75 hover:bg-base-200 w-full rounded-xl border py-3 text-sm font-semibold transition sm:flex-1"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 w-full rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-60 sm:flex-1"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
