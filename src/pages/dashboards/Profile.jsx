import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateProfile } from "../../store/slices/authSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: "",
  });
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

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, avatar: reader.result }));
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary text-xs font-black tracking-[0.25em] uppercase">
            Account settings
          </p>
          <h1 className="text-base-content mt-2 text-2xl font-black">
            Profile
          </h1>
        </div>
        <p className="text-base-content/65 text-sm">
          Keep your wallet identity up to date.
        </p>
      </div>

      <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
        <aside className="border-base-300 bg-base-200/80 min-w-0 rounded-box border p-5 text-center shadow-sm sm:p-6">
          {!user ? (
            <div className="text-base-content/50 flex items-center justify-center py-20 text-sm">
              Memuat data profile...
            </div>
          ) : (
            <>
              <div className="border-base-300 bg-base-200 mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-box border shadow-inner">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-base-content/40"
                  >
                    <path
                      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>
              <h2 className="text-base-content mt-4 text-xl font-black">
                {form.name || "User"}
              </h2>
              <p className="text-base-content/65 mt-1 text-sm break-all">
                {form.email}
              </p>
              <div className="mt-6 grid gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-black text-primary-content shadow-lg transition"
                >
                  Change Photo
                </button>
                <button
                  onClick={handleDeleteAvatar}
                  className="border-error/30 text-error hover:bg-error/10 rounded-2xl border px-5 py-3 text-sm font-black transition"
                >
                  Delete Photo
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </>
          )}
        </aside>

        <section className="border-base-300 bg-base-200/80 min-w-0 rounded-box border p-5 shadow-sm sm:p-6">
          <h2 className="text-base-content text-lg font-black">
            Personal Information
          </h2>
          <div className="mt-6 grid min-w-0 gap-5">
            <div>
              <label className="text-base-content/80 mb-2 block text-sm font-bold">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="border-base-300 bg-base-100 text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-primary/20 w-full min-w-0 rounded-2xl border px-4 py-3 text-sm shadow-sm transition outline-none focus:ring-4"
              />
            </div>
            <div>
              <label className="text-base-content/80 mb-2 block text-sm font-bold">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+628123456789"
                className="border-base-300 bg-base-100 text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-primary/20 w-full min-w-0 rounded-2xl border px-4 py-3 text-sm shadow-sm transition outline-none focus:ring-4"
              />
            </div>
            <div>
              <label className="text-base-content/80 mb-2 block text-sm font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="border-base-300 bg-base-200 text-base-content/65 w-full min-w-0 rounded-2xl border px-4 py-3 text-sm"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard/profile/change-password")}
                className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 rounded-2xl border px-4 py-3 text-sm font-black transition"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/profile/change-pin")}
                className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 rounded-2xl border px-4 py-3 text-sm font-black transition"
              >
                Change PIN
              </button>
            </div>
            {error && <p className="text-error text-sm font-bold">{error}</p>}
            {success && (
              <p className="text-success text-sm font-bold">{success}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-black text-primary-content shadow-lg transition disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
