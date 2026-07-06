import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
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
    if (!form.currentPassword || !form.newPassword || !form.confirmNewPassword)
      return setLocalError("Semua field password wajib diisi.");
    if (form.newPassword.length < 8)
      return setLocalError("Password baru minimal 8 karakter.");
    if (form.newPassword !== form.confirmNewPassword)
      return setLocalError("Konfirmasi password baru tidak cocok.");
    if (form.currentPassword === form.newPassword)
      return setLocalError(
        "Password baru tidak boleh sama dengan password lama.",
      );
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
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
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
  const fields = [
    {
      name: "currentPassword",
      label: "Current Password",
      placeholder: "Enter Your Current Password",
    },
    {
      name: "newPassword",
      label: "New Password",
      placeholder: "Enter Your New Password",
    },
    {
      name: "confirmNewPassword",
      label: "Confirm New Password",
      placeholder: "Re-Type Your New Password",
    },
  ];
  const error = localError || reduxError;
  const confirmMismatch =
    form.confirmNewPassword.length > 0 &&
    form.newPassword !== form.confirmNewPassword;

  return (
    <>
      <div>
        <p className="text-primary text-xs font-black tracking-[0.25em] uppercase">
          Security
        </p>
        <h1 className="text-base-content mt-2 text-2xl font-black">
          Change Password
        </h1>
      </div>
      <div className="border-base-300 bg-base-100 min-w-0 rounded-[1.5rem] border p-5 shadow-sm sm:p-6">
        <div className="max-w-2xl min-w-0">
          <p className="text-base-content/65 mb-6 text-sm leading-6">
            Use a password that is different from your old one and at least 8
            characters long.
          </p>
          <div className="flex w-full min-w-0 flex-col gap-5">
            {fields.map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="text-base-content/80 mb-2 block text-sm font-bold">
                  {label}
                </label>
                <div className="relative">
                  <span className="text-base-content/50 absolute top-1/2 left-4 -translate-y-1/2">
                    <LockIcon />
                  </span>
                  <input
                    type={show[name] ? "text" : "password"}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`bg-base-100 text-base-content placeholder:text-base-content/50 focus:ring-primary/20 w-full min-w-0 rounded-2xl border py-3 pr-12 pl-11 text-sm shadow-sm transition outline-none focus:ring-4 ${name === "confirmNewPassword" && confirmMismatch ? "border-error focus:border-error" : "border-base-300 focus:border-primary"}`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(name)}
                    className="text-base-content/50 hover:text-primary absolute top-1/2 right-4 -translate-y-1/2"
                  >
                    <EyeIcon visible={show[name]} />
                  </button>
                </div>
                {name === "confirmNewPassword" && confirmMismatch && (
                  <p className="text-error mt-1 text-xs font-bold">
                    Password tidak cocok.
                  </p>
                )}
              </div>
            ))}
            {error && <p className="text-error text-sm font-bold">{error}</p>}
            {success && (
              <p className="text-success text-sm font-bold">{success}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Save Password"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
