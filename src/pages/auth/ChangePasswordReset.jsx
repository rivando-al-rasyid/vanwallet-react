/**
 * ChangePasswordReset.jsx — Step 3 of 3
 *
 * Receives the short-lived reset JWT from route state (set by ConfirmReset).
 * Calls POST /auth/change-password with that JWT as Bearer token.
 *
 * On success → navigate to /login with a success message.
 * If no resetJwt in state, redirects to Step 1.
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
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

  // Guard: no JWT means they skipped steps — send back to start
  if (!resetJwt) {
    navigate("/forgotpassword", { replace: true });
    return null;
  }

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    <main className="grid min-h-screen grid-cols-1 place-items-center bg-[#2948FF] px-6 py-10">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <Brand />

        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  "bg-[#6379F4] text-white"
                }`}
              >
                {n < 3 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  n
                )}
              </div>
              {n < 3 && <div className="h-px w-8 bg-gray-200" />}
            </div>
          ))}
          <span className="ml-2 text-xs text-gray-400">New Password</span>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Password Changed!</h2>
            <p className="text-sm text-gray-500">
              Your password has been updated successfully. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <LoginHeadline
              title="Set New Password 🔐"
              text="Choose a strong password with at least 8 characters."
            />

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
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

              {/* Real-time mismatch hint */}
              {form.confirmPassword.length > 0 &&
                form.newPassword !== form.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match.</p>
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
      </section>
    </main>
  );
}
