import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";
import { useContext, useState } from "react";

import PinInput from "../../components/PinInput";
import ProfileContext from "../../context/profile/context";

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
  const { changePin, profileLoading, profileError } = useContext(ProfileContext);

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
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
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

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="max-w-3xl mx-auto w-full text-center">
          <h2 className="text-base font-bold text-gray-800 mb-1">
            Change Pin 👋
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Please save your pin because this so important.
          </p>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <PinInput />

              {methods.formState.errors.pin && (
                <p className="text-sm text-red-500 mt-4">
                  Please complete the 6-digit PIN.
                </p>
              )}

              {profileError && (
                <p className="text-sm text-red-500 mt-4">{profileError}</p>
              )}
              {success && (
                <p className="text-sm text-green-600 mt-4">{success}</p>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full mt-10 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
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
