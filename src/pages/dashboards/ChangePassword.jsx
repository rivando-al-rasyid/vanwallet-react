import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";

import { changePassword } from "../../store/slices/profileSlice";
import Joi from "joi";
import { useToast } from "../../context/toast/provider";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const userId = useSelector((state) => state.profile.user?.id ?? null);
  const loading = useSelector((state) => state.profile.loading);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
      })
    );

    if (changePassword.fulfilled.match(result)) {
      showToast("Password berhasil diupdate!", "success");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => navigate("/dashboard/profile"), 1500);
    } else {
      const msg =
        result.payload ||
        result.error?.message ||
        "Gagal mengupdate password.";
      showToast(msg, "error");
    }
  };

  const EyeButton = ({ show, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      aria-label={show ? "Hide password" : "Show password"}
    >
      <Icon
        icon={show ? "lucide:eye-off" : "lucide:eye"}
        width={18}
        height={18}
      />
    </button>
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Icon icon="lucide:user-round" width={18} height={18} color="#2563EB" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Profile</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="w-full">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Change Password
          </h2>

          <div className="flex flex-col gap-5 w-full">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Existing Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon icon="lucide:lock" width={16} height={16} aria-hidden="true" />
                </span>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter Your Existing Password"
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />
                <EyeButton
                  show={showCurrentPassword}
                  onClick={() => setShowCurrentPassword((v) => !v)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon icon="lucide:lock" width={16} height={16} aria-hidden="true" />
                </span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter Your New Password"
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />
                <EyeButton
                  show={showNewPassword}
                  onClick={() => setShowNewPassword((v) => !v)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon icon="lucide:lock" width={16} height={16} aria-hidden="true" />
                </span>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Re-Type Your New Password"
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />
                <EyeButton
                  show={showConfirmNewPassword}
                  onClick={() => setShowConfirmNewPassword((v) => !v)}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading ? "Menyimpan..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
