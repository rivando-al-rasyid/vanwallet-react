import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import PinInput from "../../components/PinInput";
import { changePin } from "../../store/slices/profileSlice";
import { useToast } from "../../context/toast/provider";
import { DEFAULT_PIN_VALUE, pinFieldSchema } from "../../schemas/pinSchema";

export default function ChangePin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const userId  = useSelector((state) => state.profile.user?.id ?? null);
  const loading = useSelector((state) => state.profile.loading);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(pinFieldSchema),
    defaultValues: {
      pin: DEFAULT_PIN_VALUE,
    },
  });

  const onSubmit = async ({ pin }) => {
    const newPin = pin.map((item) => item.value).join("");

    const result = await dispatch(changePin({ userId, newPin }));

    if (changePin.fulfilled.match(result)) {
      showToast("PIN berhasil diupdate!", "success");
      reset({ pin: DEFAULT_PIN_VALUE });
      setTimeout(() => navigate("/dashboard/profile"), 1500);
    } else {
      const msg = result.payload || result.error?.message || "Gagal mengupdate PIN.";
      showToast(msg, "error");
    }
  };
  const pinErrorMessage = errors.pin?.message || errors.pin?.[0]?.value?.message;

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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <Controller
              name="pin"
              control={control}
              render={({ field }) => (
                <PinInput value={field.value} onChange={field.onChange} />
              )}
            />

            {pinErrorMessage && (
              <p className="text-sm text-red-500 mt-4">
                {pinErrorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading ? "Menyimpan..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
