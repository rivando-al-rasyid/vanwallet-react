import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { changePassword } from "../../store/slices/profileSlice";
import { useToast } from "../../context/toast/provider";
import PasswordField from "../../components/ui/PasswordField";
import { changePasswordSchema } from "../../schemas/profileSchemas";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const userId  = useSelector((state) => state.profile.user?.id ?? null);
  const loading = useSelector((state) => state.profile.loading);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (formValues) => {
    const result = await dispatch(
      changePassword({
        userId,
        oldPassword: formValues.currentPassword,
        newPassword: formValues.newPassword,
      }),
    );

    if (changePassword.fulfilled.match(result)) {
      showToast("Password berhasil diupdate!", "success");
      reset({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => navigate("/dashboard/profile"), 1500);
    } else {
      const msg = result.payload || result.error?.message || "Gagal mengupdate password.";
      showToast(msg, "error");
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
        <h2 className="text-base font-bold text-gray-800 mb-4">Change Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
          <div>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <PasswordField
                  label="Existing Password"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter Your Existing Password"
                />
              )}
            />
            {errors.currentPassword?.message && (
              <p className="text-sm text-red-500 mt-1.5">{errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <PasswordField
                  label="New Password"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter Your New Password"
                />
              )}
            />
            {errors.newPassword?.message && (
              <p className="text-sm text-red-500 mt-1.5">{errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field }) => (
                <PasswordField
                  label="Confirm New Password"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Re-Type Your New Password"
                />
              )}
            />
            {errors.confirmNewPassword?.message && (
              <p className="text-sm text-red-500 mt-1.5">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Menyimpan..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
