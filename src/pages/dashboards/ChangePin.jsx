import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";

import PinInput from "../../components/PinInput";
import { changePin } from "../../store/slices/profileSlice";
const selectUserId = (state) => state.profile.user?.id ?? null;
const selectProfileLoading = (state) => state.profile.loading;
const selectProfileError = (state) => state.profile.error;

const defaultPin = Array(6)
  .fill(null)
  .map(() => ({ value: "" }));

const pinSchema = Joi.object({
  pin: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().length(1).pattern(/^\d$/).required(),
      })
    )
    .length(6)
    .required(),
});

export default function ChangePin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(selectUserId);
  const loading = useSelector(selectProfileLoading);
  const profileError = useSelector(selectProfileError);

  const [success, setSuccess] = useState("");

  const methods = useForm({
    resolver: joiResolver(pinSchema),
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const newPin = data.pin.map((item) => item.value).join("");
    setSuccess("");

    const result = await dispatch(changePin({ userId, newPin }));

    if (changePin.fulfilled.match(result)) {
      setSuccess("PIN berhasil diupdate!");
      methods.reset({ pin: defaultPin });
      setTimeout(() => navigate("/dashboard/profile"), 1200);
    }
  };

  return (
    <>
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
                disabled={loading}
                className="w-full mt-10 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {loading ? "Menyimpan..." : "Submit"}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
