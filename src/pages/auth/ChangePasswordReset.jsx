import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
import { changePasswordWithResetToken } from "../../utils/api";

export default function ChangePasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetJwt = location.state?.resetJwt;
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!resetJwt) {
    navigate("/forgotpassword", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.newPassword || !form.confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }
    setLoading(true);
    try {
      await changePasswordWithResetToken(resetJwt, form.newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login", { state: { passwordReset: true } }), 2000);
    } catch (err) {
      setError(err.message || "Gagal mengubah password. Token mungkin sudah kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-5 py-10">
      <section className="w-full max-w-xl rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl shadow-slate-200 sm:p-10">
        <Brand />
        <div className="mt-10">
          <div className="mb-6 flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">{n < 3 ? "✓" : n}</div>
                {n < 3 && <div className="h-px w-8 bg-slate-200" />}
              </div>
            ))}
            <span className="ml-2 text-xs font-bold text-slate-400">New Password</span>
          </div>
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">✓</div>
              <h2 className="text-xl font-black text-slate-950">Password Changed!</h2>
              <p className="text-sm text-slate-500">Your password has been updated successfully. Redirecting to login...</p>
            </div>
          ) : (
            <>
              <LoginHeadline title="Set new password 🔐" text="Choose a strong password with at least 8 characters." />
              {error && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</div>}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input label="New Password" type="password" name="newPassword" icon={faLock} placeholder="Enter your new password" value={form.newPassword} onChange={handleChange} />
                <Input label="Confirm Password" type="password" name="confirmPassword" icon={faLock} placeholder="Re-enter your new password" value={form.confirmPassword} onChange={handleChange} />
                {form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword && <p className="text-xs font-bold text-rose-500">Passwords do not match.</p>}
                <Submit name={loading ? "Saving..." : "Change Password"} disabled={loading} />
              </form>
              <LoginSubtext text="Remember your password? " link="/login" linklabel="Back to Login" />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
