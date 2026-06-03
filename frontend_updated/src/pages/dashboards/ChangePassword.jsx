import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../store/slices/authSlice";

export default function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: reduxError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async () => {
    setLocalError("");
    setSuccess("");

    if (!form.currentPassword || !form.newPassword || !form.confirmNewPassword) {
      setLocalError("Semua field password wajib diisi.");
      return;
    }
    if (form.newPassword.length < 8) {
      setLocalError("Password baru minimal 8 karakter.");
      return;
    }
    if (form.newPassword !== form.confirmNewPassword) {
      setLocalError("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (form.currentPassword === form.newPassword) {
      setLocalError("Password baru tidak boleh sama dengan password lama.");
      return;
    }

    const result = await dispatch(
      changePassword({
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    );

    if (changePassword.fulfilled.match(result)) {
      setSuccess("Password berhasil diupdate!");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => navigate("/dashboard/profile"), 1200);
    }
  };

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.94 10.94 0 0112 20C7 20 2.73 16.11 1 12c.92-2.19 2.49-4.08 4.5-5.5" />
        <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
        <path d="M9.88 5.09A10.94 10.94 0 0112 4c5 0 9.27 3.89 11 8a11.83 11.83 0 01-4.24 5.11" />
        <path d="M1 1l22 22" />
      </svg>
    );

  const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );

  const fields = [
    { name: "currentPassword", label: "Current Password", placeholder: "Enter Your Current Password" },
    { name: "newPassword", label: "New Password", placeholder: "Enter Your New Password" },
    { name: "confirmNewPassword", label: "Confirm New Password", placeholder: "Re-Type Your New Password" },
  ];

  const error = localError || reduxError;

  const confirmMismatch =
    form.confirmNewPassword.length > 0 &&
    form.newPassword !== form.confirmNewPassword;

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

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="w-full">
          <h2 className="mb-4 text-base font-bold text-gray-800">Change Password</h2>

          <div className="flex w-full flex-col gap-5">
            {fields.map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {label}
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400">
                    <LockIcon />
                  </span>
                  <input
                    type={show[name] ? "text" : "password"}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border py-3 pr-12 pl-10 text-sm text-gray-700 placeholder-gray-400 transition outline-none focus:ring-2 focus:ring-blue-100 ${
                      name === "confirmNewPassword" && confirmMismatch
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-blue-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(name)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EyeIcon visible={show[name]} />
                  </button>
                </div>
                {name === "confirmNewPassword" && confirmMismatch && (
                  <p className="mt-1 text-xs text-red-500">Password tidak cocok.</p>
                )}
              </div>
            ))}

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
