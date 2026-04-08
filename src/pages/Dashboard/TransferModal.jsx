// src/pages/transfer/TransferModal.jsx
import { useForm, FormProvider } from "react-hook-form";
import PinInput from "../../components/PinInput";
import { verifyPin } from "../../utils/auth";
export default function TransferModal({
  open,
  step, // "pin" | "failed" | "success"
  onPinSubmit,
  onDone,
  onTryAgain,
  onTransferAgain,
  toName = "",
}) {
  const methods = useForm({
    defaultValues: {
      pin: Array.from({ length: 6 }, () => ({ value: "" })),
    },
  });

  if (!open) return null;

  // --- PIN STEP ---
  if (step === "pin") {
    const handleNext = async () => {
      const pinArray = methods.getValues("pin");
      const pinString = pinArray.map((p) => p.value).join("");

      if (pinString.length < 6) {
        return alert("Masukkan PIN lengkap (6 digit)");
      }

      try {
        // Use the auth helper to verify the PIN
        await verifyPin(pinString);

        // If verification passes, trigger the submission
        onPinSubmit(pinString);
      } catch (error) {
        // You can alert the error or trigger the "failed" step manually
        alert(error.message);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-gray-800">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Transfer to {toName}
          </p>
          <h3 className="text-2xl font-bold mb-1"> Enter Your Pin 👋 </h3>
          <p className="text-sm text-gray-400 mb-8">
            Enter Your Pin For Transaction
          </p>

          <FormProvider {...methods}>
            <div className="mb-8 flex justify-center">
              <PinInput />
            </div>
          </FormProvider>

          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition mb-4 shadow-lg shadow-blue-100"
          >
            Confirm & Transfer
          </button>

          <p className="text-center text-sm text-gray-500">
            Forgot Your Pin?{" "}
            <button className="text-blue-600 font-semibold hover:underline">
              Reset
            </button>
          </p>
        </div>
      </div>
    );
  }

  // --- FAILED STEP ---
  if (step === "failed") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            ❌
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Oops Transfer <span className="text-red-500">Failed</span>
          </h3>
          <p className="text-sm text-gray-400 mb-8">
            Sorry, there is an issue with your transfer. Try again later!
          </p>
          <button
            onClick={onTryAgain}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl mb-3"
          >
            Try Again
          </button>
          <button
            onClick={onDone}
            className="w-full py-3.5 border border-gray-200 text-gray-600 rounded-xl"
          >
            Back To Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- SUCCESS STEP ---
  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            ✅
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Yeay Transfer <span className="text-green-500">Success</span>
          </h3>
          <p className="text-sm text-gray-400 mb-8">
            Thank you for using this application for your financial needs.
          </p>
          <button
            onClick={onDone}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl mb-3"
          >
            Done
          </button>
          <button
            onClick={onTransferAgain}
            className="w-full py-3.5 border border-blue-600 text-blue-600 rounded-xl"
          >
            Transfer Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
