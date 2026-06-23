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
          <span className="text-indigo-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </span>
          <h1 className="text-lg font-black text-slate-950">Transfer Money</h1>
        </div>
        <Stepper currentStep={2} />
      </div>

      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-black text-slate-950 mb-6">Transfer Detail</h2>

        {/* Recipient Info */}
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
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
            <p className="font-semibold text-slate-800">{contact.name}</p>
            <p className="text-sm text-slate-500">{contact.phone || contact.email}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
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
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            min="1"
          />
          {amount && parseFloat(amount) > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              {formatRupiah(parseFloat(amount))}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Note <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {error && (
          <p className="mb-4 text-sm font-medium text-rose-500">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard/transfer")}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Back
          </button>
          <button onClick={handleSubmit} className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 flex-1">
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
