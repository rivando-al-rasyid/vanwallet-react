import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

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

  const EyeButton = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17.94 17.94A10.94 10.94 0 0112 20C7 20 2.73 16.11 1 12c.92-2.19 2.49-4.08 4.5-5.5" />
        <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
        <path d="M9.88 5.09A10.94 10.94 0 0112 4c5 0 9.27 3.89 11 8a11.83 11.83 0 01-4.24 5.11" />
        <path d="M1 1l22 22" />
      </svg>
    </button>
  );

  const LockIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );

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
                  <LockIcon />
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
                  <LockIcon />
                </span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter Your New Password"
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />
                <EyeButton onClick={() => setShowNewPassword((v) => !v)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <LockIcon />
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
