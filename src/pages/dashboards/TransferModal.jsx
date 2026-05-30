// src/pages/dashboard/TransferModal.jsx
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useEffect } from "react";
import PinInput from "../../components/PinInput";
import Modal from "../../components/Modal";
import transferFailedImage from "../../assets/img/failed.png";
import transferSuccessImage from "../../assets/img/success.png";

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
        <p className="mb-4 text-left text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Transfer to {toName}
        </p>

        <h3 className="mb-1 text-left text-2xl font-bold">Enter Your Pin 👋</h3>

        <p className="mb-8 text-left text-sm text-gray-400">
          Enter Your Pin For Transaction
        </p>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleConfirm)} className="mb-2">
            <div className="mb-8 flex justify-center">
              <PinInput />
            </div>

            {methods.formState.errors.pin && (
              <p className="mb-4 text-left text-sm text-red-500">
                Masukkan PIN lengkap ({PIN_LENGTH} digit)
              </p>
            )}

            <button type="submit" className="btn-primary mb-4 w-full">
              Confirm & Transfer
            </button>
          </form>
        </FormProvider>

        <p className="text-sm text-gray-500">
          Forgot Your Pin?{" "}
          <button className="font-semibold text-blue-600 hover:underline">
            Reset
          </button>
        </p>
      </Modal>
    );
  }

  if (step === "failed") {
    return (
      <Modal open={open}>
        <img src={transferFailedImage} alt="failed" className="mx-auto mb-4" />

        <h3 className="section-title mb-2">
          Oops Transfer <span className="text-red-500">Failed</span>
        </h3>

        <p className="mb-8 text-sm text-gray-400">
          Sorry, there is an issue with your transfer. Try again later!
        </p>

        <button onClick={onTryAgain} className="btn-primary mb-3 w-full">
          Try Again
        </button>

        <button
          onClick={onDone}
          className="w-full rounded-xl border border-blue-600 py-3.5 text-blue-600"
        >
          Back To Dashboard
        </button>
      </Modal>
    );
  }

  if (step === "success") {
    return (
      <Modal open={open}>
        <img
          src={transferSuccessImage}
          alt="success"
          className="mx-auto mb-4"
        />

        <h3 className="section-title mb-2">
          Yeay Transfer <span className="text-green-500">Success</span>
        </h3>

        <p className="mb-8 text-sm text-gray-400">
          Thank you for using this application.
        </p>

        <button onClick={onDone} className="btn-primary mb-3 w-full">
          Done
        </button>

        <button
          onClick={onTransferAgain}
          className="w-full rounded-xl border border-blue-600 py-3.5 text-blue-600"
        >
          Transfer Again
        </button>
      </Modal>
    );
  }

  return null;
}
