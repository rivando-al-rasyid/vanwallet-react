// src/pages/dashboard/TransferModal.jsx
import { useForm, FormProvider } from "react-hook-form";
import PinInput from "../../components/PinInput";

const PIN_LENGTH = 6;

export default function TransferModal({
  open,
  step,
  onPinSubmit,
  onDone,
  onTryAgain,
  onTransferAgain,
  toName = "",
}) {
  const methods = useForm({
    defaultValues: {
      pin: Array.from({ length: PIN_LENGTH }, () => ({ value: "" })),
    },
  });

  if (!open) return null;

  const handleConfirm = () => {
    const pin = methods
      .getValues("pin")
      .map((p) => p.value)
      .join("");

    if (pin.length !== PIN_LENGTH) {
      alert("Masukkan PIN lengkap (6 digit)");
      return;
    }

    onPinSubmit(pin);
  };

  const ModalWrapper = ({ children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        {children}
      </div>
    </div>
  );

  if (step === "pin") {
    return (
      <ModalWrapper>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 text-left">
          Transfer to {toName}
        </p>

        <h3 className="text-2xl font-bold mb-1 text-left">Enter Your Pin 👋</h3>

        <p className="text-sm text-gray-400 mb-8 text-left">
          Enter Your Pin For Transaction
        </p>

        <FormProvider {...methods}>
          <div className="mb-8 flex justify-center">
            <PinInput />
          </div>
        </FormProvider>

        <button
          onClick={handleConfirm}
          className="btn-primary w-full mb-4"
        >
          Confirm & Transfer
        </button>

        <p className="text-sm text-gray-500">
          Forgot Your Pin?{" "}
          <button className="text-blue-600 font-semibold hover:underline">
            Reset
          </button>
        </p>
      </ModalWrapper>
    );
  }

  if (step === "failed") {
    return (
      <ModalWrapper>
        <img src="/img/failed.png" alt="failed" className="mx-auto mb-4" />

        <h3 className="section-title mb-2">
          Oops Transfer <span className="text-red-500">Failed</span>
        </h3>

        <p className="text-sm text-gray-400 mb-8">
          Sorry, there is an issue with your transfer. Try again later!
        </p>

        <button
          onClick={onTryAgain}
          className="btn-primary w-full mb-3"
        >
          Try Again
        </button>

        <button
          onClick={onDone}
          className="w-full py-3.5 border border-blue-600 text-blue-600 rounded-xl"
        >
          Back To Dashboard
        </button>
      </ModalWrapper>
    );
  }

  if (step === "success") {
    return (
      <ModalWrapper>
        <img src="/img/success.png" alt="success" className="mx-auto mb-4" />

        <h3 className="section-title mb-2">
          Yeay Transfer <span className="text-green-500">Success</span>
        </h3>

        <p className="text-sm text-gray-400 mb-8">
          Thank you for using this application.
        </p>

        <button
          onClick={onDone}
          className="btn-primary w-full mb-3"
        >
          Done
        </button>

        <button
          onClick={onTransferAgain}
          className="w-full py-3.5 border border-blue-600 text-blue-600 rounded-xl"
        >
          Transfer Again
        </button>
      </ModalWrapper>
    );
  }

  return null;
}
