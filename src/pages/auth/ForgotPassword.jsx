import { useState } from "react";
import { useNavigate } from "react-router";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import PinInput from "../../components/PinInput";
import { useToast } from "../../context/toast/provider";
import { PIN_LENGTH } from "../../schemas/pinSchema";
import {
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  verifyPasswordResetOtp,
} from "../../utils/userUtils";

const STEP = {
  EMAIL: "email",
  OTP: "otp",
  RESET: "reset",
};

const createOtpDigits = () =>
  Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(STEP.EMAIL);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(createOtpDigits());
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email) {
      setErrorMessage("Email wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordResetOtp(email);
      setStep(STEP.OTP);
      setOtp(createOtpDigits());
      showToast("OTP sent. Please check your email.", "success");
    } catch (error) {
      setErrorMessage(error.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpValue) => {
    setErrorMessage("");
    setLoading(true);
    try {
      await verifyPasswordResetOtp(email, otpValue);
      setVerifiedOtp(otpValue);
      setStep(STEP.RESET);
      showToast("OTP verified.", "success");
    } catch (error) {
      if (error.message === "Invalid OTP") {
        setErrorMessage("Invalid OTP");
      } else if (error.message === "OTP expired, request a new code") {
        setErrorMessage("OTP expired, request a new code");
      } else {
        setErrorMessage(error.message || "Failed to verify OTP.");
      }
      setOtp(createOtpDigits());
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      await requestPasswordResetOtp(email);
      setOtp(createOtpDigits());
      showToast("OTP resent.", "success");
    } catch (error) {
      setErrorMessage(error.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!newPassword || newPassword.length < 8) {
      setErrorMessage("Password minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithOtp({ email, otpCode: verifiedOtp, newPassword });
      showToast("Password reset successful. Please login again.", "success");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#2948FF] flex items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 sm:p-10 shadow-xl">
        <Brand />
        <LoginHeadline
          title={step === STEP.EMAIL ? "Fill Out Form Correctly 👋" : "Secure Recovery 👋"}
          text={
            step === STEP.EMAIL
              ? "We will send OTP to your email"
              : step === STEP.OTP
                ? "Verify OTP first before setting a new password"
                : "Set your new password"
          }
        />

        {step === STEP.EMAIL && (
          <form className="space-y-6" onSubmit={onSendOtp}>
            <div>
              <Input
                label="Email"
                type="email"
                icon="lucide:mail"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500 -mt-2">{errorMessage}</p>
            )}
            <Submit label={loading ? "Loading..." : "Send OTP"} disabled={loading} />
          </form>
        )}

        {step === STEP.OTP && (
          <section className="space-y-6">
            <p className="text-sm font-semibold text-gray-600">Enter OTP</p>
            <PinInput
              value={otp}
              onChange={setOtp}
              type="tel"
              ariaLabelPrefix="OTP digit"
              autoComplete="one-time-code"
              onComplete={handleVerifyOtp}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">
                {errorMessage}
              </p>
            )}
            <button
              type="button"
              className="text-sm text-blue-600 font-semibold hover:underline"
              disabled={loading}
              onClick={onResendOtp}
            >
              Resend OTP
            </button>
          </section>
        )}

        {step === STEP.RESET && (
          <form className="space-y-6" onSubmit={onResetPassword}>
            <Input
              label="New Password"
              type="password"
              icon="lucide:lock"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm Password"
              type="password"
              icon="lucide:lock"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessage && (
              <p className="text-sm text-red-500 -mt-2">{errorMessage}</p>
            )}
            <Submit label={loading ? "Loading..." : "Reset Password"} disabled={loading} />
          </form>
        )}
      </section>
    </main>
  );
}
