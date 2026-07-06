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
      setTimeout(
        () => navigate("/login", { state: { passwordReset: true } }),
        2000,
      );
    } catch (err) {
      setError(
        err.message ||
          "Gagal mengubah password. Token mungkin sudah kadaluarsa.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-base-200 grid min-h-screen place-items-center overflow-x-hidden px-4 py-8 sm:px-5 sm:py-10">
      <section className="border-base-300 bg-base-100/90 shadow-base-content/10 w-full max-w-xl rounded-[1.5rem] border p-5 shadow-2xl sm:rounded-[2rem] sm:p-10">
        <Brand />
        <div className="mt-10">
          <div className="mb-6 flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 sm:gap-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex shrink-0 items-center gap-1.5 sm:gap-2"
              >
                <div className="bg-primary text-primary-content flex h-8 w-8 items-center justify-center rounded-full text-xs font-black">
                  {n < 3 ? "✓" : n}
                </div>
                {n < 3 && <div className="bg-base-300 h-px w-5 sm:w-8" />}
              </div>
            ))}
            <span className="text-base-content/50 ml-1 shrink-0 text-xs font-bold sm:ml-2">
              New Password
            </span>
          </div>
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="bg-success/10 text-success flex h-16 w-16 items-center justify-center rounded-3xl">
                ✓
              </div>
              <h2 className="text-base-content text-xl font-black">
                Password Changed!
              </h2>
              <p className="text-base-content/65 text-sm">
                Your password has been updated successfully. Redirecting to
                login...
              </p>
            </div>
          ) : (
            <>
              <LoginHeadline
                title="Set new password 🔐"
                text="Choose a strong password with at least 8 characters."
              />
              {error && (
                <div className="border-error/30 bg-error/10 text-error mb-4 rounded-2xl border px-4 py-3 text-sm font-bold">
                  {error}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  icon={faLock}
                  placeholder="Enter your new password"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  icon={faLock}
                  placeholder="Re-enter your new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                {form.confirmPassword.length > 0 &&
                  form.newPassword !== form.confirmPassword && (
                    <p className="text-error text-xs font-bold">
                      Passwords do not match.
                    </p>
                  )}
                <Submit
                  name={loading ? "Saving..." : "Change Password"}
                  disabled={loading}
                />
              </form>
              <LoginSubtext
                text="Remember your password? "
                link="/login"
                linklabel="Back to Login"
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
