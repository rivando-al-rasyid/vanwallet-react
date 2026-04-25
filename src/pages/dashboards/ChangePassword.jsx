import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import Joi from "joi";

import { changePassword } from "../../store/slices/profileSlice";
import { useToast } from "../../context/toast/provider";
import PasswordField from "../../components/ui/PasswordField";

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Password saat ini tidak boleh kosong.",
    "any.required": "Password saat ini wajib diisi.",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "Password baru tidak boleh kosong.",
    "string.min": "Password baru minimal 8 karakter.",
    "any.required": "Password baru wajib diisi.",
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "string.empty": "Konfirmasi password tidak boleh kosong.",
    "any.only": "Konfirmasi password baru tidak cocok.",
    "any.required": "Konfirmasi password wajib diisi.",
  }),
});

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const userId  = useSelector((state) => state.profile.user?.id ?? null);
  const loading = useSelector((state) => state.profile.loading);

  const [form, setForm] = useState({
    currentPassword:    "",
    newPassword:        "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { error: validationError } = changePasswordSchema.validate(form, { abortEarly: true });
    if (validationError) {
      showToast(validationError.message, "error");
      return;
    }

    const result = await dispatch(
      changePassword({
        userId,
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    );

    if (changePassword.fulfilled.match(result)) {
      showToast("Password berhasil diupdate!", "success");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
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

        <div className="flex flex-col gap-5 w-full">
          <PasswordField
            label="Existing Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter Your Existing Password"
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter Your New Password"
          />
          <PasswordField
            label="Confirm New Password"
            name="confirmNewPassword"
            value={form.confirmNewPassword}
            onChange={handleChange}
            placeholder="Re-Type Your New Password"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Menyimpan..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
}
