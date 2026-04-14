import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";

import { getSession, updateUser } from "../../utils/auth";
import PinInput from "../../components/PinInput";

import { useState } from "react";

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
  const { id } = getSession();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const methods = useForm({
    resolver: joiResolver(pinSchema),
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const pinValue = data.pin.map((item) => item.value).join("");

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateUser(id, { pin: pinValue });
      setSuccess("PIN berhasil diupdate!");
      methods.reset({ pin: defaultPin });
      setTimeout(() => navigate("/dashboard/profile"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
        <h1 className="section-title">Profile</h1>
      </div>

      <div className="card">
        <div className="max-w-3xl mx-auto w-full text-center">
          <h2 className="section-title mb-1">
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

              {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
              {success && (
                <p className="text-sm text-green-600 mt-4">{success}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full mt-10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Menyimpan..." : "Submit"}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
