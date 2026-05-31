/**
 * TopUp.jsx
 *
 * Two-step top-up flow aligned to Swagger spec:
 *   Step 1: POST /transactions/topup         → initiates deposit, returns { id }
 *   Step 2: POST /transactions/topup/{id}/confirm → finalizes the deposit
 */

import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { initiateTopup, confirmTopup } from "../../utils/api";

const TAX_RATE = 0.1;

const PAYMENT_METHODS = [
  {
    id: "bri",
    name: "Bank Rakyat Indonesia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/BRI_2025.svg/500px-BRI_2025.svg.png",
  },
  {
    id: "dana",
    name: "Dana",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/500px-Logo_dana_blue.svg.png",
  },
  {
    id: "bca",
    name: "Bank Central Asia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/500px-Bank_Central_Asia.svg.png",
  },
  {
    id: "gopay",
    name: "Gopay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/500px-Gopay_logo.svg.png",
  },
  {
    id: "ovo",
    name: "Ovo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/500px-Logo_ovo_purple.svg.png",
  },
];

// Step states
const STEP = { FORM: "form", CONFIRM: "confirm", SUCCESS: "success" };

export default function TopUp() {
  const { user: currentUser } = useAuth();

  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bri");
  const [step, setStep] = useState(STEP.FORM);
  const [pendingTopupId, setPendingTopupId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    if (!currentUser?.id) return null;
    return {
      name: currentUser.name || "User",
      phone: currentUser.phone || "No Phone",
      avatar: currentUser.avatar || "",
    };
  }, [currentUser]);

  const order = parseFloat(amount) || 0;
  const tax = Math.round(order * TAX_RATE);
  const subTotal = order + tax;

  const fmtIdr = (val = 0) =>
    val === 0 ? "Idr. 0" : `Idr. ${val.toLocaleString("id-ID")}`;

  /**
   * Step 1: POST /transactions/topup
   * Initiates the deposit pipeline, receives a topup ID for confirmation
   */
  const handleInitiate = async () => {
    if (!amount || order <= 0) {
      setError("Masukkan nominal top up yang valid.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await initiateTopup({
        amount: subTotal,
        paymentMethod: selectedMethod,
      });
      setPendingTopupId(result?.id);
      setStep(STEP.CONFIRM);
    } catch (err) {
      setError(err.message || "Gagal memulai top up. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: POST /transactions/topup/{id}/confirm
   * Finalizes the pending top-up event
   */
  const handleConfirm = async () => {
    if (!pendingTopupId) return;
    setError("");
    setLoading(true);
    try {
      await confirmTopup(pendingTopupId);
      setStep(STEP.SUCCESS);
    } catch (err) {
      setError(err.message || "Gagal mengkonfirmasi top up. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAmount("");
    setSelectedMethod("bri");
    setPendingTopupId(null);
    setStep(STEP.FORM);
    setError("");
  };

  const methodName =
    PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name || selectedMethod;

  return (
    <>
      {/* Page Title */}
      <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 sm:h-10 sm:w-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="sm:h-4 sm:w-4">
            <path
              d="M19.5039 2.07729C20.1889 1.87802 20.931 2.07025 21.434 2.58253C21.937 3.0938 22.123 3.83957 21.918 4.52999L20.669 8.73188C20.55 9.13144 20.1339 9.35789 19.7359 9.23913C19.3389 9.11936 19.1129 8.69867 19.2319 8.30012L20.481 4.09722C20.551 3.86171 20.4259 3.7027 20.3689 3.64533C20.3119 3.58696 20.1519 3.46014 19.9209 3.52758L3.82937 8.20652C3.57336 8.281 3.51736 8.49537 3.50536 8.58394C3.49436 8.6725 3.49036 8.89392 3.71837 9.03482L7.10449 11.1182C7.4575 11.3355 7.5695 11.8005 7.35249 12.1568C7.21149 12.3883 6.96548 12.5171 6.71247 12.5171C6.57947 12.5171 6.44446 12.4819 6.32246 12.4064L2.93634 10.3221C2.26532 9.90942 1.91331 9.16667 2.01831 8.38265C2.12331 7.59762 2.65833 6.97464 3.41336 6.75523L19.5039 2.07729ZM18.0282 12.3492C18.1482 11.9487 18.5652 11.7212 18.9622 11.842C19.3592 11.9618 19.5852 12.3824 19.4662 12.782L17.1441 20.596C16.9191 21.3519 16.2971 21.8833 15.5201 21.9829C15.4331 21.995 15.3471 22 15.2611 22C14.583 22 13.963 21.6518 13.602 21.0539L9.50187 14.2645C9.32286 13.9666 9.36786 13.5841 9.61287 13.3386L15.4341 7.48007C15.7271 7.18518 16.2011 7.18518 16.4941 7.48007C16.7871 7.77496 16.7871 8.25302 16.4941 8.54791L11.0899 13.9877L14.8841 20.2699C15.0221 20.4984 15.2391 20.4964 15.3291 20.4863C15.4171 20.4742 15.6301 20.4199 15.7061 20.1643L18.0282 12.3492Z"
              fill="#2563EB"
            />
          </svg>
        </div>
        <h1 className="section-title">Top Up Account</h1>
      </div>

      {/* ── SUCCESS STATE ───────────────────────────────────────── */}
      {step === STEP.SUCCESS && (
        <div className="card flex flex-col items-center gap-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Top Up Berhasil!</h2>
            <p className="mt-1 text-sm text-gray-500">
              {fmtIdr(subTotal)} via {methodName} telah ditambahkan ke saldo Anda.
            </p>
          </div>
          <button onClick={handleReset} className="btn-primary">
            Top Up Lagi
          </button>
        </div>
      )}

      {/* ── CONFIRM STATE ───────────────────────────────────────── */}
      {step === STEP.CONFIRM && (
        <div className="flex flex-col items-start gap-4 sm:gap-6 lg:flex-row">
          <div className="card w-full">
            <h2 className="section-title mb-4">Konfirmasi Top Up</h2>
            <div className="mb-6 flex flex-col gap-3 rounded-xl bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span className="font-semibold text-gray-800">{methodName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nominal</span>
                <span className="font-semibold text-gray-800">{fmtIdr(order)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (10%)</span>
                <span className="font-semibold text-gray-800">{fmtIdr(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-sm font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-blue-600">{fmtIdr(subTotal)}</span>
              </div>
            </div>

            {error && (
              <p className="mb-4 text-sm font-medium text-red-500">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(STEP.FORM)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                disabled={loading}
              >
                Kembali
              </button>
              <button
                onClick={handleConfirm}
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FORM STATE ──────────────────────────────────────────── */}
      {step === STEP.FORM && (
        <div className="flex flex-col items-start gap-4 sm:gap-6 lg:flex-row">
          {/* Left Panel */}
          <div className="card w-full">
            <h2 className="section-title mb-3 sm:mb-4">Account Information</h2>
            <div className="mb-6 rounded-lg bg-gray-50 p-3 sm:mb-8 sm:rounded-xl sm:p-4">
              {user ? (
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover sm:h-12 sm:w-12 sm:rounded-xl lg:h-14 lg:w-14"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5";
                    }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 sm:text-base">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 sm:text-sm">{user.phone}</p>
                    <span className="badge badge-success mt-1">Verified</span>
                  </div>
                </div>
              ) : (
                <div className="flex animate-pulse items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200 sm:h-12 sm:w-12 sm:rounded-xl lg:h-14 lg:w-14" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-3 w-24 rounded bg-gray-200 sm:h-4 sm:w-32" />
                    <div className="h-2.5 w-20 rounded bg-gray-200 sm:h-3 sm:w-24" />
                  </div>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="mb-6 sm:mb-8">
              <h2 className="section-title mb-1">Amount</h2>
              <p className="mb-2 text-xs text-gray-400 sm:mb-3 sm:text-sm">
                Type the amount you want to add to your e-wallet account
              </p>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                placeholder="Enter Nominal Transfer"
                className="form-input"
                min="0"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <h2 className="section-title mb-1">Payment Method</h2>
              <p className="mb-3 text-xs text-gray-400 sm:mb-4 sm:text-sm">
                Choose your payment method for top up account
              </p>
              <div className="flex flex-col gap-2 sm:gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-all sm:gap-3 sm:rounded-xl sm:p-3 lg:gap-4 lg:p-4 ${
                      selectedMethod === method.id
                        ? "border-blue-400 bg-blue-50/40"
                        : "border-gray-100 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="h-4 w-4 shrink-0 accent-blue-600"
                    />
                    <div className="flex h-7 w-10 shrink-0 items-center justify-center sm:h-8 sm:w-12">
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/40x24?text=Pay";
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 sm:text-sm">
                      {method.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="card w-full shrink-0 lg:w-72">
            <h2 className="section-title mb-3 sm:mb-6">Payment</h2>
            <div className="mb-3 flex flex-col gap-3 sm:mb-6 sm:gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 sm:text-sm">Order</span>
                <span className="text-xs font-semibold text-gray-800 sm:text-sm">
                  {fmtIdr(order)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 sm:text-sm">Tax (10%)</span>
                <span className="text-xs font-semibold text-gray-800 sm:text-sm">
                  {fmtIdr(tax)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:pt-4">
                <span className="text-xs font-bold text-gray-800 sm:text-sm">
                  Sub Total
                </span>
                <span className="text-xs font-bold text-gray-800 sm:text-sm">
                  {fmtIdr(subTotal)}
                </span>
              </div>
            </div>

            {error && (
              <p className="mb-3 text-xs font-medium text-red-500">{error}</p>
            )}

            <button
              onClick={handleInitiate}
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
