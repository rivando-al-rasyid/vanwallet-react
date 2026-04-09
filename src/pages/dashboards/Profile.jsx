import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { getUserById, updateUser, getSession } from "../../utils/auth";

export default function Profile() {
  const { id } = getSession();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const user = await getUserById(id);
        setForm({
          name: user.name || "",
          phone: user.phone || "",
          email: user.email || "",
          avatar: user.avatar || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = () => {
    setForm((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateUser(id, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        avatar: form.avatar,
      });
      setSuccess("Profile berhasil diupdate!");
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
        <h1 className="text-xl font-bold text-gray-800">Profile</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Memuat data profile...
          </div>
        ) : (
          <>
            {/* Avatar Section */}
            <div className="flex flex-row items-center gap-6">
              {/* Avatar Image Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                {form.avatar ? (
                  <img
                    src={form.avatar}
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

              {/* Buttons Container - Changed width to auto so they don't stretch */}
              <div className="flex flex-col gap-2 w-auto">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
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
                  Change Profile
                </button>

                <button
                  onClick={handleDeleteAvatar}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-400 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition"
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

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full py-3 sm:py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition mt-2"
              >
                {saving ? "Menyimpan..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
