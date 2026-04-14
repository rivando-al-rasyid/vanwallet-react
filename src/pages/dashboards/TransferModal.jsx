// src/pages/dashboard/TransferModal.jsx
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useEffect } from "react";
import PinInput from "../../components/PinInput";
import Modal from "../../components/Modal";

const PIN_LENGTH = 6;
const defaultPin = Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

const pinSchema = Joi.object({
  pin: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().length(1).pattern(/^\d$/).required(),
      }),
    )
    .length(PIN_LENGTH)
    .required(),
});

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
    resolver: joiResolver(pinSchema),
    defaultValues: {
      pin: defaultPin,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (open && step === "pin") {
      methods.reset({ pin: defaultPin });
    }
  }, [methods, open, step]);

  if (!open) return null;

  const handleConfirm = ({ pin }) => {
    const pinValue = pin.map((p) => p.value).join("");
    onPinSubmit(pinValue);
  };

  if (step === "pin") {
    return (
      <Modal open={open}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 text-left">
          Transfer to {toName}
        </p>

        <h3 className="text-2xl font-bold mb-1 text-left">Enter Your Pin 👋</h3>

        <p className="text-sm text-gray-400 mb-8 text-left">
          Enter Your Pin For Transaction
        </p>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleConfirm)}
            className="mb-2"
          >
            <div className="mb-8 flex justify-center">
              <PinInput />
            </div>

            {methods.formState.errors.pin && (
              <p className="text-sm text-red-500 mb-4 text-left">
                Masukkan PIN lengkap ({PIN_LENGTH} digit)
              </p>
            )}

            <button
              type="submit"
              className="btn-primary w-full mb-4"
            >
              Confirm & Transfer
            </button>
          </form>
        </FormProvider>

        <p className="text-sm text-gray-500">
          Forgot Your Pin?{" "}
          <button className="text-blue-600 font-semibold hover:underline">
            Reset
          </button>
        </p>
      </Modal>
    );
  }

  if (step === "failed") {
    return (
      <Modal open={open}>
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
      </Modal>
    );
  }

  if (step === "success") {
    return (
      <Modal open={open}>
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
      </Modal>
    );
  }

  return null;
}
