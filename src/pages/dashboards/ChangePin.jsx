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

  const [success, setSuccess] = useState("");

  const methods = useForm({
    resolver: joiResolver(pinSchema),
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const pinValue = data.pin.map((item) => item.value).join("");

    setSuccess("");

    try {
      await changePin(pinValue);
      setSuccess("PIN berhasil diupdate!");
      methods.reset({ pin: defaultPin });
      setTimeout(() => navigate("/dashboard/profile"), 1200);
    } catch {
      // error is handled by context/Redux via profileError
    }
  };

  return (
    <>
      {/* Page Title */}
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
          <h2 className="mb-1 text-base font-bold text-gray-800">
            Change Pin 👋
          </h2>
          <p className="mb-8 text-sm text-gray-400">
            Please save your pin because this so important.
          </p>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <PinInput />

              {methods.formState.errors.pin && (
                <p className="mt-4 text-sm text-red-500">
                  Please complete the 6-digit PIN.
                </p>
              )}

              {profileError && (
                <p className="mt-4 text-sm text-red-500">{profileError}</p>
              )}
              {success && (
                <p className="mt-4 text-sm text-green-600">{success}</p>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="mt-10 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {profileLoading ? "Menyimpan..." : "Submit"}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
