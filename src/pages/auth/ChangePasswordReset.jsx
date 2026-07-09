import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import LoginHeadline from "../../components/login/LoginHeadline";
import StepIndicator from "../../components/login/StepIndicator";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
import { AuthCenteredLayout } from "../../layouts/AuthLayout";
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
    <AuthCenteredLayout>
      <StepIndicator currentStep={3} label="New Password" />
      {success ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="bg-success/10 text-success flex h-14 w-14 items-center justify-center rounded-2xl text-xl">
            ✓
          </div>
          <h2 className="text-base-content text-lg font-black">
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
            <div className="border-error/30 bg-error/10 text-error mb-3 rounded-xl border px-3 py-2 text-xs font-bold">
              {error}
            </div>
          )}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
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
    </AuthCenteredLayout>
  );
}
