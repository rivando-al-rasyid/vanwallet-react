import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import PinInput from "../../components/PinInput";
import Brand from "../../components/Brand";
import LoginImage from "../../components/login/LoginImage";
import { verifyPin } from "../../utils/auth";

const PIN_LENGTH = 6;
const defaultPin = Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

export default function LoginPin() {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    const pin = data.pin.map((item) => item.value).join("");
    if (pin.length !== PIN_LENGTH) {
      setError("Please complete the 6-digit PIN.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await verifyPin(pin);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid PIN. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      <section className="auth-panel">
        <div className="w-full max-w-175">
          <Brand />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Enter Your PIN
          </h1>
          <p className="text-white/80 mt-2 mb-8 text-sm sm:text-base">
            Input your 6-digit PIN to continue.
          </p>

          <FormProvider {...methods}>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <PinInput />

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Checking..." : "Continue"}
              </button>
            </form>
          </FormProvider>
        </div>
      </section>

      <LoginImage img="/img/3d-hand-phone.png" />
    </main>
  );
}
