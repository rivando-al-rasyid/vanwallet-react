import { useMemo, useState } from "react";
import Joi from "joi";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { useToast } from "../../context/toast/provider";
import { useConfirm } from "../../context/confirm/provider";
import { applyTransactionWithBalanceUpdate } from "../../utils/transactionFlow";
import { fetchBalance } from "../../store/slices/profileSlice";
import { resetHistory } from "../../store/slices/historySlice";

const TAX_RATE = 0.1;

const PAYMENT_METHODS = [
  { id: "bri", name: "Bank Rakyat Indonesia", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/BRI_2025.svg/500px-BRI_2025.svg.png" },
  { id: "dana", name: "Dana", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/500px-Logo_dana_blue.svg.png" },
  { id: "bca", name: "Bank Central Asia", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/500px-Bank_Central_Asia.svg.png" },
  { id: "gopay", name: "Gopay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/500px-Gopay_logo.svg.png" },
  { id: "ovo", name: "Ovo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/500px-Logo_ovo_purple.svg.png" },
];

export default function TopUp() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.profile.user);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bri");
  const [submitting, setSubmitting] = useState(false);

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

  const topUpSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
      "number.base": "Nominal harus berupa angka.",
      "number.positive": "Nominal harus lebih dari 0.",
      "any.required": "Nominal wajib diisi.",
    }),
    selectedMethod: Joi.string().required().messages({
      "any.required": "Pilih metode pembayaran.",
    }),
  });

  const handleSubmit = async () => {
    const { error: validationError } = topUpSchema.validate(
      { amount: parseFloat(amount) || undefined, selectedMethod },
      { abortEarly: true },
    );
    if (validationError) {
      showToast(validationError.message, "error");
      return;
    }

    const methodName = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name;

    const ok = await confirm({
      title: "Konfirmasi Top Up",
      message: `Top Up ${fmtIdr(subTotal)} via ${methodName}. Lanjutkan?`,
      confirmLabel: "Ya, Top Up",
      cancelLabel: "Batal",
      variant: "info",
    });

    if (!ok) return;

    try {
      setSubmitting(true);

      await applyTransactionWithBalanceUpdate({
        userId: currentUser?.id,
        transactionType: "deposit",
        transactionDesc: `Top Up via ${methodName} sebesar ${fmtIdr(subTotal)}`,
        amount: subTotal,
        balanceMutation: (currentBalanceValue) => currentBalanceValue + subTotal,
      });
      dispatch(fetchBalance(currentUser?.id));
      dispatch(resetHistory());

      showToast(`Top Up ${fmtIdr(subTotal)} via ${methodName} berhasil! 🎉`, "success");
      setAmount("");
    } catch (err) {
      showToast(err.message || "Top Up gagal. Coba lagi.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon icon="lucide:upload" width={14} height={14} color="#2563EB" className="sm:w-4 sm:h-4" aria-hidden="true" />
        </div>
        <h1 className="section-title">Top Up Account</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
        {/* Left Panel */}
        <div className="card w-full">
          <h2 className="section-title mb-3 sm:mb-4">Account Information</h2>
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-6 sm:mb-8">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl object-cover shrink-0"
                  onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5"; }}
                />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-gray-800">{user.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{user.phone}</p>
                  <span className="badge badge-success mt-1">Verified</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 animate-pulse">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32" />
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-20 sm:w-24" />
                </div>
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="mb-6 sm:mb-8">
            <h2 className="section-title mb-1">Amount</h2>
            <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
              Type the amount you want to transfer to your e-wallet account
            </p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Nominal Transfer"
              className="form-input"
            />
          </div>

          {/* Payment Methods */}
          <div>
            <h2 className="section-title mb-1">Payment Method</h2>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              Choose your payment method for top up account
            </p>
            <div className="flex flex-col gap-2 sm:gap-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${
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
                    className="accent-blue-600 w-4 h-4 shrink-0"
                  />
                  <div className="w-10 h-7 sm:w-12 sm:h-8 flex items-center justify-center shrink-0">
                    <img
                      src={method.logo}
                      alt={method.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/40x24?text=Pay"; }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{method.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="card w-full lg:w-72 shrink-0">
          <h2 className="section-title mb-3 sm:mb-6">Payment</h2>
          <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-500">Order</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800">{fmtIdr(order)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-500">Tax (10%)</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800">{fmtIdr(tax)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 sm:pt-4 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-gray-800">Sub Total</span>
              <span className="text-xs sm:text-sm font-bold text-gray-800">{fmtIdr(subTotal)}</span>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Memproses..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
}
