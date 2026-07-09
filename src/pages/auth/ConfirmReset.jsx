import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import LoginHeadline from "../../components/login/LoginHeadline";
import StepIndicator from "../../components/login/StepIndicator";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
import { AuthCenteredLayout } from "../../layouts/AuthLayout";
import { confirmPasswordReset } from "../../utils/api";

export default function ConfirmReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!token.trim()) {
      setError("Token wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const response = await confirmPasswordReset(token.trim());
      navigate("/forgotpassword/change", {
        state: {
          resetJwt: response?.resetToken || response?.token || response?.jwt,
        },
      });
    } catch (err) {
      setError(err.message || "Token tidak valid atau sudah kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCenteredLayout>
      <StepIndicator currentStep={2} label="Enter Token" />
      <LoginHeadline
        title="Check your email 📬"
        text={
          email
            ? `We sent a reset token to ${email}. Paste it below.`
            : "Paste the reset token from your email below."
        }
      />
      {error && (
        <div className="border-error/30 bg-error/10 text-error mb-3 rounded-xl border px-3 py-2 text-xs font-bold">
          {error}
        </div>
      )}
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-base-content/80 ml-1 block text-xs font-bold sm:text-sm">
            Reset Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError("");
            }}
            placeholder="Paste your reset token here"
            className="border-base-300 bg-base-100 text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-primary/20 w-full min-w-0 rounded-xl border px-3.5 py-2.5 text-sm shadow-sm transition outline-none focus:ring-4"
            autoComplete="one-time-code"
          />
          <p className="text-base-content/50 ml-1 text-xs">
            Token expires in 5 minutes. Check spam if you do not see it.
          </p>
        </div>
        <Submit
          name={loading ? "Verifying..." : "Verify Token"}
          disabled={loading}
        />
      </form>
      <LoginSubtext
        text="Didn't receive a token? "
        link="/forgotpassword"
        linklabel="Try again"
      />
    </AuthCenteredLayout>
  );
}
