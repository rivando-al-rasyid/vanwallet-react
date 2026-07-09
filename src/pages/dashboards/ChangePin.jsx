import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi";

import PinInput from "../../components/PinInput";
import { changePin } from "../../store/slices/authSlice";

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
  const dispatch = useDispatch();
  const { loading, error: reduxError } = useSelector((state) => state.auth);

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

  const getPinFromData = (data) => data.pin.map((item) => item.value).join("");

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
      if (pin !== newPinValue) {
        setLocalError("PIN baru tidak cocok. Silakan ulangi.");
        methods.reset({ pin: defaultPin });
        return;
      }
      submitPin(pin);
    }
  });

  const submitPin = async (confirmPin) => {
    setSuccess("");
    const result = await dispatch(
      changePin({ currentPin: currentPinValue, newPin: confirmPin }),
    );
    if (changePin.fulfilled.match(result)) {
      setSuccess("PIN berhasil diupdate!");
      setTimeout(() => navigate("/dashboard/profile"), 1200);
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
      button: loading ? "Menyimpan..." : "Submit",
    },
  };

  const config = stepConfig[step];
  const error = localError || reduxError;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="bg-primary/15 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className="text-base-content text-xl font-bold">Profile</h1>
      </div>

      <div className="bg-base-200/80 min-w-0 rounded-2xl p-5 shadow-sm sm:p-8">
        <div className="mx-auto w-full max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-1.5 sm:gap-2">
            {["current", "new", "confirm"].map((s, i) => (
              <div
                key={s}
                className="flex shrink-0 items-center gap-1.5 sm:gap-2"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    step === s
                      ? "bg-primary text-primary-content"
                      : ["new", "confirm"].indexOf(s) <
                          ["current", "new", "confirm"].indexOf(step)
                        ? "bg-primary/25 text-primary"
                        : "bg-base-200 text-base-content/50"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="bg-base-300 h-px w-4 sm:w-6" />}
              </div>
            ))}
          </div>

          <h2 className="text-base-content mb-1 text-base font-bold">
            {config.title}
          </h2>
          <p className="text-base-content/50 mb-8 text-sm">
            {config.description}
          </p>

          <FormProvider {...methods}>
            <form onSubmit={handleNext} className="flex flex-col items-center">
              <PinInput key={step} autoComplete="current-password" />

              {methods.formState.errors.pin && (
                <p className="text-error mt-4 text-sm">
                  Please complete the 6-digit PIN.
                </p>
              )}
              {error && <p className="text-error mt-4 text-sm">{error}</p>}
              {success && (
                <p className="text-success mt-4 text-sm">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-content hover:bg-primary/90 mt-8 w-full rounded-xl py-3.5 text-sm font-semibold transition disabled:opacity-60 sm:mt-10"
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
                  className="text-base-content/50 hover:text-base-content/75 mt-3 text-sm"
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
