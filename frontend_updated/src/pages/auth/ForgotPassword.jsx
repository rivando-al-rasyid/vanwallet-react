/**
 * ForgotPassword.jsx — Step 1 of 3
 *
 * Collects the user's email and calls POST /auth/reset.
 * On success, navigates to /forgotpassword/confirm passing the email
 * in route state so the next step can display it.
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
import { requestPasswordReset } from "../../utils/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      navigate("/forgotpassword/confirm", { state: { email: email.trim() } });
    } catch (err) {
      setError(err.message || "Gagal mengirim permintaan. Coba lagi.");
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
                  n === 1
                    ? "bg-[#6379F4] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {n}
              </div>
              {n < 3 && <div className="h-px w-8 bg-gray-200" />}
            </div>
          ))}
          <span className="ml-2 text-xs text-gray-400">Enter Email</span>
        </div>

        <LoginHeadline
          title="Forgot Password? 🔑"
          text="Enter your registered email and we'll generate a reset token for you."
        />

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            icon={faEnvelope}
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
          />
          <Submit name={loading ? "Sending..." : "Send Reset Token"} disabled={loading} />
        </form>

        <LoginSubtext
          text="Remember your password? "
          link="/login"
          linklabel="Back to Login"
        />
      </section>
    </main>
  );
}
