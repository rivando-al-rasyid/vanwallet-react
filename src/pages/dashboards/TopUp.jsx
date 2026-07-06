import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchSummary,
  initiateTopup,
  resetTopup,
} from "../../store/slices/transactionSlice";

const PAYMENT_METHODS = [
  {
    id: "BRI",
    name: "Bank Rakyat Indonesia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/BRI_2025.svg/500px-BRI_2025.svg.png",
  },
  {
    id: "DANA",
    name: "Dana",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/500px-Logo_dana_blue.svg.png",
  },
  {
    id: "BCA",
    name: "Bank Central Asia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/500px-Bank_Central_Asia.svg.png",
  },
  {
    id: "GOPAY",
    name: "Gopay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/500px-Gopay_logo.svg.png",
  },
  {
    id: "OVO",
    name: "Ovo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/500px-Logo_ovo_purple.svg.png",
  },
];

const STEP = {
  FORM: "form",
  PENDING: "pending",
};

export default function TopUp() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const topupStatus = useSelector((state) => state.transaction.topup.status);

  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("BRI");
  const [step, setStep] = useState(STEP.FORM);
  const [topupResult, setTopupResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoading = loading || topupStatus === "loading";

  const user = useMemo(() => {
    if (!currentUser?.id) return null;

    return {
      name: currentUser.name || "User",
      phone: currentUser.phone || "No Phone",
      avatar: currentUser.avatar || "",
    };
  }, [currentUser]);

  const topupAmount = parseFloat(amount) || 0;

  const fmtIdr = (value = 0) => {
    if (value === 0) return "Idr. 0";

    return `Idr. ${value.toLocaleString("id-ID")}`;
  };

  const getWalletId = async () => {
    const summary = await dispatch(fetchSummary()).unwrap();
    const firstWallet = summary?.wallets?.[0];

    if (!firstWallet?.id) {
      throw new Error("Wallet tidak ditemukan. Hubungi support.");
    }

    return firstWallet.id;
  };

  const handleFormSubmit = async () => {
    if (!amount || topupAmount <= 0) {
      setError("Masukkan nominal top up yang valid.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const walletId = await getWalletId();

      const result = await dispatch(
        initiateTopup({
          walletId,
          amount: topupAmount,
          paymentMethod: selectedMethod,
        }),
      ).unwrap();

      if (!result?.id) {
        throw new Error(
          "Top up berhasil dibuat, tetapi ID transaksi tidak ditemukan.",
        );
      }

      setTopupResult(result);
      setStep(STEP.PENDING);
    } catch (err) {
      setError(err?.message || err || "Gagal memulai top up. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAmount("");
    setSelectedMethod("BRI");
    setTopupResult(null);
    setStep(STEP.FORM);
    setError("");
    dispatch(resetTopup());
  };

  const methodName =
    PAYMENT_METHODS.find((method) => method.id === selectedMethod)?.name ||
    selectedMethod;

  return (
    <>
      <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
        <div className="bg-primary/15 text-primary flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="sm:h-4 sm:w-4"
          >
            <path
              d="M19.5039 2.07729C20.1889 1.87802 20.931 2.07025 21.434 2.58253C21.937 3.0938 22.123 3.83957 21.918 4.52999L20.669 8.73188C20.55 9.13144 20.1339 9.35789 19.7359 9.23913C19.3389 9.11936 19.1129 8.69867 19.2319 8.30012L20.481 4.09722C20.551 3.86171 20.4259 3.7027 20.3689 3.64533C20.3119 3.58696 20.1519 3.46014 19.9209 3.52758L3.82937 8.20652C3.57336 8.281 3.51736 8.49537 3.50536 8.58394C3.49436 8.6725 3.49036 8.89392 3.71837 9.03482L7.10449 11.1182C7.4575 11.3355 7.5695 11.8005 7.35249 12.1568C7.21149 12.3883 6.96548 12.5171 6.71247 12.5171C6.57947 12.5171 6.44446 12.4819 6.32246 12.4064L2.93634 10.3221C2.26532 9.90942 1.91331 9.16667 2.01831 8.38265C2.12331 7.59762 2.65833 6.97464 3.41336 6.75523L19.5039 2.07729ZM18.0282 12.3492C18.1482 11.9487 18.5652 11.7212 18.9622 11.842C19.3592 11.9618 19.5852 12.3824 19.4662 12.782L17.1441 20.596C16.9191 21.3519 16.2971 21.8833 15.5201 21.9829C15.4331 21.995 15.3471 22 15.2611 22C14.583 22 13.963 21.6518 13.602 21.0539L9.50187 14.2645C9.32286 13.9666 9.36786 13.5841 9.61287 13.3386L15.4341 7.48007C15.7271 7.18518 16.2011 7.18518 16.4941 7.48007C16.7871 7.77496 16.7871 8.25302 16.4941 8.54791L11.0899 13.9877L14.8841 20.2699C15.0221 20.4984 15.2391 20.4964 15.3291 20.4863C15.4171 20.4742 15.6301 20.4199 15.7061 20.1643L18.0282 12.3492Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className="text-base-content text-lg font-black">Top Up Account</h1>
      </div>

      {step === STEP.PENDING && (
        <div className="border-base-300 bg-base-100 flex min-w-0 flex-col items-center gap-6 rounded-[1.5rem] border p-5 py-12 text-center shadow-sm sm:p-6 sm:py-16">
          <div className="bg-primary/15 text-primary flex h-16 w-16 items-center justify-center rounded-full">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v5l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-base-content text-lg font-bold">
              Top Up Request Created
            </h2>
            <p className="text-base-content/65 mt-1 max-w-md text-sm">
              {fmtIdr(topupResult?.amount ?? topupAmount)} via {methodName} is
              now pending. Your balance will update after the payment webhook
              confirms the transaction.
            </p>
          </div>

          <div className="bg-base-200 w-full max-w-md rounded-xl p-4 text-left text-sm">
            <div className="flex flex-col gap-1 py-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-base-content/65">Status</span>
              <span className="font-semibold text-amber-600">
                {topupResult?.status || "PENDING"}
              </span>
            </div>
            <div className="flex flex-col gap-1 py-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-base-content/65">Payment Method</span>
              <span className="text-base-content font-semibold break-words sm:text-right">
                {methodName}
              </span>
            </div>
            <div className="flex flex-col gap-1 py-1 sm:flex-row sm:justify-between sm:gap-4">
              <span className="text-base-content/65">Amount</span>
              <span className="text-base-content font-semibold break-words sm:text-right">
                {fmtIdr(topupResult?.amount ?? topupAmount)}
              </span>
            </div>
            {topupResult?.external_reference && (
              <div className="flex flex-col gap-1 py-1 sm:flex-row sm:justify-between sm:gap-4">
                <span className="text-base-content/65">Reference</span>
                <span className="text-base-content text-right font-semibold break-all">
                  {topupResult.external_reference}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-60"
          >
            Create Another Top Up
          </button>
        </div>
      )}

      {step === STEP.FORM && (
        <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-6 xl:flex-row">
          <div className="border-base-300 bg-base-100 w-full min-w-0 rounded-[1.5rem] border p-5 shadow-sm sm:p-6">
            <h2 className="text-base-content mb-3 text-lg font-black sm:mb-4">
              Account Information
            </h2>

            <div className="bg-base-200 mb-6 rounded-lg p-3 sm:mb-8 sm:rounded-xl sm:p-4">
              {user ? (
                <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover sm:h-12 sm:w-12 sm:rounded-xl lg:h-14 lg:w-14"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5";
                    }}
                  />

                  <div className="min-w-0">
                    <p className="text-base-content truncate text-sm font-semibold sm:text-base">
                      {user.name}
                    </p>
                    <p className="text-base-content/65 truncate text-xs sm:text-sm">
                      {user.phone}
                    </p>
                    <span className="bg-success/10 text-success mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black">
                      Verified
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex animate-pulse items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-base-300 h-10 w-10 shrink-0 rounded-lg sm:h-12 sm:w-12 sm:rounded-xl lg:h-14 lg:w-14" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="bg-base-300 h-3 w-24 rounded sm:h-4 sm:w-32" />
                    <div className="bg-base-300 h-2.5 w-20 rounded sm:h-3 sm:w-24" />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-base-content mb-1 text-lg font-black">
                Amount
              </h2>
              <p className="text-base-content/50 mb-2 text-xs sm:mb-3 sm:text-sm">
                Type the amount you want to add to your e-wallet account.
              </p>

              <input
                type="number"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError("");
                }}
                placeholder="Enter top up amount"
                className="border-base-300 bg-base-100 text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-primary/20 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm transition outline-none focus:ring-4"
                min="0"
              />
            </div>

            <div>
              <h2 className="text-base-content mb-1 text-lg font-black">
                Payment Method
              </h2>
              <p className="text-base-content/50 mb-3 text-xs sm:mb-4 sm:text-sm">
                Choose your payment method for top up account.
              </p>

              <div className="flex flex-col gap-2 sm:gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-all sm:gap-3 sm:rounded-xl sm:p-3 lg:gap-4 lg:p-4 ${
                      selectedMethod === method.id
                        ? "border-primary/60 bg-primary/10"
                        : "border-base-300 bg-base-200 hover:border-base-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="h-4 w-4 shrink-0 accent-indigo-600"
                    />

                    <div className="flex h-7 w-10 shrink-0 items-center justify-center sm:h-8 sm:w-12">
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://placehold.co/40x24?text=Pay";
                        }}
                      />
                    </div>

                    <span className="text-base-content/80 min-w-0 text-xs font-medium break-words sm:text-sm">
                      {method.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-base-300 bg-base-100 w-full min-w-0 shrink-0 rounded-[1.5rem] border p-5 shadow-sm sm:p-6 xl:w-80">
            <h2 className="text-base-content mb-3 text-lg font-black sm:mb-6">
              Payment
            </h2>

            <div className="mb-3 flex flex-col gap-3 sm:mb-6 sm:gap-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-base-content/65 text-xs sm:text-sm">
                  Amount
                </span>
                <span className="text-base-content text-right text-xs font-semibold break-words sm:text-sm">
                  {fmtIdr(topupAmount)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-base-content/65 text-xs sm:text-sm">
                  Payment Method
                </span>
                <span className="text-base-content text-right text-xs font-semibold break-words sm:text-sm">
                  {selectedMethod}
                </span>
              </div>

              <div className="border-base-300 flex items-center justify-between border-t pt-3 sm:pt-4">
                <span className="text-base-content text-right text-xs font-bold break-words sm:text-sm">
                  Total
                </span>
                <span className="text-base-content text-right text-xs font-bold break-words sm:text-sm">
                  {fmtIdr(topupAmount)}
                </span>
              </div>
            </div>

            <p className="bg-primary/10 text-primary mb-3 rounded-lg p-3 text-xs leading-relaxed">
              The backend now creates a pending top up only. Balance crediting
              is handled by your payment webhook.
            </p>

            {error && (
              <p className="text-error mb-3 text-xs font-medium">{error}</p>
            )}

            <button
              onClick={handleFormSubmit}
              className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 w-full rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Create Top Up"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
