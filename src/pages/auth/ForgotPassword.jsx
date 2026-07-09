import { useState } from "react";
import { useNavigate } from "react-router";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import LoginHeadline from "../../components/login/LoginHeadline";
import StepIndicator from "../../components/login/StepIndicator";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
import { CenteredAuthLayout } from "../../layouts/CenteredAuthLayout";
import { requestPasswordReset } from "../../utils/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email);
      navigate("/forgotpassword/confirm", { state: { email } });
    } catch (err) {
      setError(err.message || "Gagal mengirim token reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredAuthLayout>
      <StepIndicator currentStep={1} label="Email" />
      <LoginHeadline
        title="Reset your password"
        text="Enter your email and we will send you a reset token."
      />
      {error && (
        <div
          role="alert"
          className="alert alert-error alert-soft mb-3 py-2 text-xs font-bold"
        >
          {error}
        </div>
      )}
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          icon={faEnvelope}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />
        <Submit
          name={loading ? "Sending..." : "Send Reset Token"}
          disabled={loading}
        />
      </form>
      <LoginSubtext
        text="Remember your password? "
        link="/login"
        linklabel="Back to Login"
      />
    </CenteredAuthLayout>
  );
}
