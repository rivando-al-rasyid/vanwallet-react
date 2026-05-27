import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";

import PinInput from "../../components/PinInput";
import { useProfile } from "../../hooks/useProfile";

const defaultPin = Array(6)
  .fill(null)
  .map(() => ({ value: "" }));

const pinSchema = Joi.object({
  pin: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().length(1).pattern(/^\d$/).required(),
      }),
    )
    .length(6)
    .required(),
});

export default function ChangePin() {
  const navigate = useNavigate();
  const { changePin, profileLoading, profileError } = useProfile();

  const [step, setStep] = useState("current"); // "current" | "new" | "confirm"
  const [currentPinValue, setCurrentPinValue] = useState("");
  const [newPinValue, setNewPinValue] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  const methods = useForm({
    resolver: joiResolver(pinSchema),
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });

  const getPinFromData = (data) =>
    data.pin.map((item) => item.value).join("");

  const handleNext = methods.handleSubmit((data) => {
    const pin = getPinFromData(data);
    setLocalError("");

    if (step === "current") {
      setCurrentPinValue(pin);
      setStep("new");
      methods.reset({ pin: defaultPin });
    } else if (step === "new") {
      setNewPinValue(pin);
      setStep("confirm");
      methods.reset({ pin: defaultPin });
    } else if (step === "confirm") {
      const confirmPin = pin;
      if (confirmPin !== newPinValue) {
        setLocalError("PIN baru tidak cocok. Silakan ulangi.");
        methods.reset({ pin: defaultPin });
        return;
      }
      submitPin(confirmPin);
    }
  });

  const submitPin = async (confirmPin) => {
    setSuccess("");
    try {
      await changePin(currentPinValue, confirmPin);
      setSuccess("PIN berhasil diupdate!");
      setTimeout(() => navigate("/dashboard/profile"), 1200);
    } catch {
      // error handled by Redux via profileError
    }
  };

  const stepConfig = {
    current: {
      title: "Current PIN",
      description: "Enter your current 6-digit PIN to verify your identity.",
      button: "Next",
    },
    new: {
      title: "New PIN",
      description: "Enter your new 6-digit PIN.",
      button: "Next",
    },
    confirm: {
      title: "Confirm New PIN",
      description: "Re-enter your new PIN to confirm.",
      button: profileLoading ? "Menyimpan..." : "Submit",
    },
  };

  const config = stepConfig[step];
  const error = localError || profileError;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
              fill="#2563EB"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Profile</h1>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="mx-auto w-full max-w-3xl text-center">
          {/* Step indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {["current", "new", "confirm"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    step === s
                      ? "bg-blue-600 text-white"
                      : ["new", "confirm"].indexOf(s) <
                          ["current", "new", "confirm"].indexOf(step)
                        ? "bg-blue-200 text-blue-700"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="h-px w-6 bg-gray-200" />}
              </div>
            ))}
          </div>

          <h2 className="mb-1 text-base font-bold text-gray-800">
            {config.title}
          </h2>
          <p className="mb-8 text-sm text-gray-400">{config.description}</p>

          <FormProvider {...methods}>
            <form
              onSubmit={handleNext}
              className="flex flex-col items-center"
            >
              <PinInput key={step} />

              {methods.formState.errors.pin && (
                <p className="mt-4 text-sm text-red-500">
                  Please complete the 6-digit PIN.
                </p>
              )}
              {error && (
                <p className="mt-4 text-sm text-red-500">{error}</p>
              )}
              {success && (
                <p className="mt-4 text-sm text-green-600">{success}</p>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="mt-10 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {config.button}
              </button>

              {step !== "current" && (
                <button
                  type="button"
                  onClick={() => {
                    setStep(step === "confirm" ? "new" : "current");
                    setLocalError("");
                    methods.reset({ pin: defaultPin });
                  }}
                  className="mt-3 text-sm text-gray-400 hover:text-gray-600"
                >
                  ← Back
                </button>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
