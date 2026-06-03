import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/slices/authSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", phone: "", email: "", avatar: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = () => {
    setForm((prev) => ({ ...prev, avatar: "" }));
    setPhotoFile(null);
  };

  const handleSubmit = async () => {
    setSuccess("");
    const result = await dispatch(
      updateProfile({ fullName: form.name, phone: form.phone, photoFile }),
    );
    if (updateProfile.fulfilled.match(result)) {
      setPhotoFile(null);
      setSuccess("Profile berhasil diupdate!");
    }
  };

  return (
    <>
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

      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        {!user ? (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400">
            Memuat data profile...
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100 sm:h-20 sm:w-20">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt="avatar"
                    className="h-full w-full object-cover"
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

              <div className="flex w-auto flex-col gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Change Profile
                </button>
                <button
                  onClick={handleDeleteAvatar}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-400 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  Delete Profile
                </button>
              </div>
            </div>
            <div className="mb-8 border-t border-gray-100" />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div className="flex w-full flex-col gap-4 sm:gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-4 text-sm text-gray-700 placeholder-gray-400 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+628123456789"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-4 text-sm text-gray-700 placeholder-gray-400 transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-4 text-sm text-gray-500 sm:py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/profile/change-password")}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Change Password
                </button>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Pin
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/profile/change-pin")}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Change Pin
                </button>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:py-3.5"
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
