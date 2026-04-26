import { useEffect, useState } from "react";

import PinInput from "../PinInput";
import Modal from "../Modal";
import {
  PIN_LENGTH,
  DEFAULT_PIN_VALUE,
  pinFieldSchema,
} from "../../schemas/pinSchema";
import transferFailedImage from "../../assets/img/failed.png";
import transferSuccessImage from "../../assets/img/success.png";

/**
 * Multi-step modal for the transfer flow.
 *
 * Steps:
 *   "pin"     → user enters their 6-digit PIN
 *   "success" → transfer completed
 *   "failed"  → transfer failed
 *
 * @param {object}   props
 * @param {boolean}  props.open
 * @param {"pin"|"success"|"failed"|null} props.step
 * @param {Function} props.onPinSubmit    - (pinString: string) => void
 * @param {Function} props.onDone         - navigates back to dashboard
 * @param {Function} props.onTryAgain     - reopens PIN step
 * @param {Function} props.onTransferAgain - starts a new transfer
 * @param {string}   props.toName         - recipient display name
 */
export default function TransferModal({
  open,
  step,
  onPinSubmit,
  onDone,
  onTryAgain,
  onTransferAgain,
  toName = "",
}) {
  const [pin, setPin] = useState(DEFAULT_PIN_VALUE);
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    if (open && step === "pin") {
      setPin(DEFAULT_PIN_VALUE);
      setPinError("");
    }
  }, [open, step]);

  if (!open) return null;

  const handlePinConfirm = (e) => {
    e.preventDefault();
    const { error } = pinFieldSchema.validate({ pin }, { abortEarly: true });
    if (error) {
      setPinError(`Masukkan PIN lengkap (${PIN_LENGTH} digit)`);
      return;
    }

    setPinError("");
    const pinString = pin.map((p) => p.value).join("");
    onPinSubmit(pinString);
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

        <form
          onSubmit={handlePinConfirm}
          className="mb-2"
        >
          <div className="mb-8 flex justify-center">
            <PinInput value={pin} onChange={setPin} />
          </div>

          {pinError && (
            <p className="text-sm text-red-500 mb-4 text-left">
              {pinError}
            </p>
          )}

          <button type="submit" className="btn-primary w-full mb-4">
            Confirm & Transfer
          </button>
        </form>

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
        <img
          src={transferFailedImage}
          alt="Transfer failed"
          className="mx-auto mb-4"
        />

        <h3 className="section-title mb-2">
          Oops Transfer <span className="text-red-500">Failed</span>
        </h3>

        <p className="text-sm text-gray-400 mb-8">
          Sorry, there is an issue with your transfer. Try again later!
        </p>

        <button onClick={onTryAgain} className="btn-primary w-full mb-3">
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
        <img
          src={transferSuccessImage}
          alt="Transfer successful"
          className="mx-auto mb-4"
        />

        <h3 className="section-title mb-2">
          Yeay Transfer <span className="text-green-500">Success</span>
        </h3>

        <p className="text-sm text-gray-400 mb-8">
          Thank you for using this application.
        </p>

        <button onClick={onDone} className="btn-primary w-full mb-3">
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
