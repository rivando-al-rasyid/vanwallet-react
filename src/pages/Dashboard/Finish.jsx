import { useLocation, useNavigate } from "react-router";
import Stepper from "../../components/Stepper";

export default function Finish() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Guard: if someone lands here directly without state, redirect back
  if (!state?.name || !state?.amount) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-red-500 font-semibold text-sm">Data transfer tidak ditemukan.</p>
        <button
          onClick={() => navigate("/dashboard/transfer")}
          className="text-xs text-blue-600 underline"
        >
          Kembali ke Transfer
        </button>
      </div>
    );
  }

  const { name, phone, img, amount, notes } = state;

  const formattedAmount = Number(amount).toLocaleString("id-ID");

  return (
    <>
      {/* Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </span>
          <h1 className="text-xl font-bold text-gray-800">Transfer Money</h1>
        </div>
        <Stepper currentStep={3} />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 min-h-150">
        {/* Success Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800">Transfer Berhasil!</h2>
          <p className="text-sm text-gray-500 mt-1">Transaksi kamu telah berhasil diproses</p>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-4">
          {/* Recipient */}
          <div className="flex items-center gap-4">
            <img
              src={img}
              alt={name}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EBF4FF&color=7F9CF5`;
              }}
            />
            <div>
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-sm text-gray-500">{phone}</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Amount Row */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Jumlah Transfer</span>
            <span className="text-sm font-bold text-gray-800">Rp{formattedAmount}</span>
          </div>

          {/* Notes Row — only shown if notes exist */}
          {notes && (
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-500 shrink-0">Catatan</span>
              <span className="text-sm text-gray-700 text-right">{notes}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </>
  );
}
