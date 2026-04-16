import { useMemo, useState } from "react";
import Joi from "joi";
import { useSelector } from "react-redux";

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

export default function TopUp() {
  const currentUser = useSelector((state) => state.profile.user);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("bri");
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

  const [topUpError, setTopUpError] = useState("");

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

  const handleSubmit = () => {
    setTopUpError("");
    const { error: validationError } = topUpSchema.validate(
      { amount: parseFloat(amount) || undefined, selectedMethod },
      { abortEarly: true },
    );
    if (validationError) {
      setTopUpError(validationError.message);
      return;
    }
    // const methodName = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name;
    // alert(\`Top Up \${fmtIdr(subTotal)} via \${methodName} berhasil!\`);
  };

  return (
    <>
      {/* Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center ">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="sm:w-4 sm:h-4"
          >
            <path
              d="M19.5039 2.07729C20.1889 1.87802 20.931 2.07025 21.434 2.58253C21.937 3.0938 22.123 3.83957 21.918 4.52999L20.669 8.73188C20.55 9.13144 20.1339 9.35789 19.7359 9.23913C19.3389 9.11936 19.1129 8.69867 19.2319 8.30012L20.481 4.09722C20.551 3.86171 20.4259 3.7027 20.3689 3.64533C20.3119 3.58696 20.1519 3.46014 19.9209 3.52758L3.82937 8.20652C3.57336 8.281 3.51736 8.49537 3.50536 8.58394C3.49436 8.6725 3.49036 8.89392 3.71837 9.03482L7.10449 11.1182C7.4575 11.3355 7.5695 11.8005 7.35249 12.1568C7.21149 12.3883 6.96548 12.5171 6.71247 12.5171C6.57947 12.5171 6.44446 12.4819 6.32246 12.4064L2.93634 10.3221C2.26532 9.90942 1.91331 9.16667 2.01831 8.38265C2.12331 7.59762 2.65833 6.97464 3.41336 6.75523L19.5039 2.07729ZM18.0282 12.3492C18.1482 11.9487 18.5652 11.7212 18.9622 11.842C19.3592 11.9618 19.5852 12.3824 19.4662 12.782L17.1441 20.596C16.9191 21.3519 16.2971 21.8833 15.5201 21.9829C15.4331 21.995 15.3471 22 15.2611 22C14.583 22 13.963 21.6518 13.602 21.0539L9.50187 14.2645C9.32286 13.9666 9.36786 13.5841 9.61287 13.3386L15.4341 7.48007C15.7271 7.18518 16.2011 7.18518 16.4941 7.48007C16.7871 7.77496 16.7871 8.25302 16.4941 8.54791L11.0899 13.9877L14.8841 20.2699C15.0221 20.4984 15.2391 20.4964 15.3291 20.4863C15.4171 20.4742 15.6301 20.4199 15.7061 20.1643L18.0282 12.3492Z"
              fill="#2563EB"
            />
          </svg>
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
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5";
                  }}
                />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {user.phone}
                  </p>
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
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/40x24?text=Pay";
                      }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {method.name}
                  </span>
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
              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                {fmtIdr(order)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-500">
                Tax (10%)
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                {fmtIdr(tax)}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3 sm:pt-4 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                Sub Total
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                {fmtIdr(subTotal)}
              </span>
            </div>
          </div>
          {topUpError && (
            <p className="text-sm text-red-500 mb-3">{topUpError}</p>
          )}
          <button onClick={handleSubmit} className="btn-primary w-full">
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
