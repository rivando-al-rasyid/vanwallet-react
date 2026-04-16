import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { updateProfile, uploadAvatar } from "../../store/slices/profileSlice";
import Joi from "joi";
const selectUser = (state) => state.profile.user;
const selectUserId = (state) => state.profile.user?.id ?? null;
const selectProfileLoading = (state) => state.profile.loading;
const selectProfileError = (state) => state.profile.error;

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const userId = useSelector(selectUserId);
  const loading = useSelector(selectProfileLoading);
  const profileError = useSelector(selectProfileError);

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");
  const fileInputRef = useRef(null);

  // Sync form from Redux whenever the persisted user changes
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const result = await dispatch(uploadAvatar({ userId, file }));

    if (uploadAvatar.fulfilled.match(result)) {
      setSuccess("Avatar berhasil diupdate!");
    }
  };

  const handleDeleteAvatar = async () => {
    if (!userId) return;
    const result = await dispatch(updateProfile({ userId, payload: { avatar: "" } }));
    if (updateProfile.fulfilled.match(result)) {
      setSuccess("Avatar dihapus.");
    }
  };

  const profileSchema = Joi.object({
    name: Joi.string().min(2).required().messages({
      "string.empty": "Nama tidak boleh kosong.",
      "string.min": "Nama minimal 2 karakter.",
      "any.required": "Nama wajib diisi.",
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s]{8,15}$/).required().messages({
      "string.empty": "Nomor telepon tidak boleh kosong.",
      "string.pattern.base": "Format nomor telepon tidak valid.",
      "any.required": "Nomor telepon wajib diisi.",
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      "string.empty": "Email tidak boleh kosong.",
      "string.email": "Format email tidak valid.",
      "any.required": "Email wajib diisi.",
    }),
  });

  const handleSubmit = async () => {
    setSuccess("");

    const { error: validationError } = profileSchema.validate(form, { abortEarly: true });
    if (validationError) {
      setLocalError(validationError.message);
      return;
    }
    setLocalError("");

    const result = await dispatch(
      updateProfile({
        userId,
        payload: {
          name: form.name,
          phone: form.phone,
          email: form.email,
        },
      })
    );

    if (updateProfile.fulfilled.match(result)) {
      setSuccess("Profile berhasil diupdate!");
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

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
        {!user ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Memuat data profile...
          </div>
        ) : (
          <>
            {/* Avatar Section */}
            <div className="flex flex-row items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                      fill="#9CA3AF"
                    />
                  </svg>
                )}
              </div>

              <div className="flex flex-col gap-2 w-auto">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  {loading ? "Mengupload..." : "Change Profile"}
                </button>

                <button
                  onClick={handleDeleteAvatar}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-400 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 disabled:opacity-60 transition"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                  Delete Profile
                </button>
              </div>
            </div>
            <div className="border-t border-gray-100 mb-8" />

            {/* Hidden file input — triggers avatar upload directly */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {/* Form Fields */}
            <div className="flex flex-col gap-4 sm:gap-5 w-full">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter Full Name"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter Your Number Phone"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/profile/change-password")}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Change Password
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Pin
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/profile/change-pin")}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Change Pin
                </button>
              </div>

              {(localError || profileError) && (
                <p className="text-sm text-red-500">{localError || profileError}</p>
              )}
              {success && (
                <p className="text-sm text-green-600">{success}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition mt-2"
              >
                {loading ? "Menyimpan..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
