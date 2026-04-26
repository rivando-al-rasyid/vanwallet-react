import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";

import PinInput from "../../components/PinInput";
import { changePin } from "../../store/slices/profileSlice";
import { useToast } from "../../context/toast/provider";
import { DEFAULT_PIN_VALUE, PIN_LENGTH } from "../../schemas/pinSchema";
import { verifyPin } from "../../utils/userUtils";

const PIN_STEP = {
  CURRENT: "current",
  NEW: "new",
  CONFIRM: "confirm",
};

const createDigits = () =>
  Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

export default function ChangePin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const userId  = useSelector((state) => state.profile.user?.id ?? null);
  const loading = useSelector((state) => state.profile.loading);

  const [step, setStep] = useState(PIN_STEP.CURRENT);
  const [currentPin, setCurrentPin] = useState(DEFAULT_PIN_VALUE);
  const [newPin, setNewPin] = useState(DEFAULT_PIN_VALUE);
  const [confirmPin, setConfirmPin] = useState(DEFAULT_PIN_VALUE);
  const [inlineError, setInlineError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stepTitle = useMemo(() => {
    if (step === PIN_STEP.CURRENT) return "Current PIN";
    if (step === PIN_STEP.NEW) return "New PIN";
    return "Confirm new PIN";
  }, [step]);

  const toPinString = (pinValue) => pinValue.map((item) => item.value).join("");
  const isComplete = (pinValue) =>
    pinValue.every((item) => String(item?.value || "").length === 1);

  const onSubmit = async (e) => {
    e.preventDefault();
    setInlineError("");

    if (step === PIN_STEP.CURRENT) {
      if (!isComplete(currentPin)) {
        setInlineError(`Please enter complete PIN (${PIN_LENGTH} digits).`);
        return;
      }
      setSubmitting(true);
      try {
        await verifyPin(userId, toPinString(currentPin));
      } catch (error) {
        setInlineError("Incorrect current PIN");
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      setStep(PIN_STEP.NEW);
      return;
    }

    if (step === PIN_STEP.NEW) {
      if (!isComplete(newPin)) {
        setInlineError(`Please enter complete PIN (${PIN_LENGTH} digits).`);
        return;
      }
      setStep(PIN_STEP.CONFIRM);
      return;
    }

    if (!isComplete(confirmPin)) {
      setInlineError(`Please enter complete PIN (${PIN_LENGTH} digits).`);
      return;
    }

    const currentPinValue = toPinString(currentPin);
    const newPinValue = toPinString(newPin);
    const confirmPinValue = toPinString(confirmPin);

    if (newPinValue !== confirmPinValue) {
      setInlineError("PIN does not match, please enter again");
      setConfirmPin(createDigits());
      return;
    }

    setSubmitting(true);
    const result = await dispatch(changePin({ userId, currentPin: currentPinValue, newPin: newPinValue }));
    setSubmitting(false);

    if (changePin.fulfilled.match(result)) {
      showToast("PIN berhasil diupdate!", "success");
      setStep(PIN_STEP.CURRENT);
      setCurrentPin(createDigits());
      setNewPin(createDigits());
      setConfirmPin(createDigits());
      setTimeout(() => navigate("/dashboard/profile"), 1500);
    } else {
      if (String(result.payload || "").toLowerCase().includes("invalid pin")) {
        setInlineError("Incorrect current PIN");
        setStep(PIN_STEP.CURRENT);
        setCurrentPin(createDigits());
        return;
      }
      const msg = result.payload || result.error?.message || "Gagal mengupdate PIN.";
      setInlineError(msg);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Icon icon="lucide:user-round" width={18} height={18} color="#2563EB" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Profile</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="max-w-3xl mx-auto w-full text-center">
          <h2 className="text-base font-bold text-gray-800 mb-1">Change Pin 👋</h2>
          <p className="text-sm text-gray-400 mb-8">
            Please save your pin because this so important.
          </p>

          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center"
          >
            <p className="w-full text-left text-sm font-semibold text-gray-600 mb-4">
              {stepTitle}
            </p>

            {step === PIN_STEP.CURRENT && (
              <PinInput value={currentPin} onChange={setCurrentPin} />
            )}
            {step === PIN_STEP.NEW && (
              <PinInput value={newPin} onChange={setNewPin} />
            )}
            {step === PIN_STEP.CONFIRM && (
              <PinInput value={confirmPin} onChange={setConfirmPin} />
            )}

            {inlineError && (
              <p className="text-sm text-red-500 mt-4">
                {inlineError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || submitting}
              className="w-full mt-10 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading || submitting ? "Menyimpan..." : step === PIN_STEP.CONFIRM ? "Submit" : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
