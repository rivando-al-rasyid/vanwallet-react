/**
 * ConfirmReset.jsx — Step 2 of 3
 *
 * User pastes the opaque token from their email/SMS.
 * Calls POST /auth/reset/confirm → receives a short-lived reset JWT (10 min).
 * Passes the JWT in route state to Step 3 (/forgotpassword/change).
 *
 * If the user lands here without going through Step 1 (no email in state),
 * they can still complete the flow — email is display-only.
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
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
      setError("Token tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      // Returns the short-lived reset JWT string
      const resetJwt = await confirmPasswordReset(token.trim());
      navigate("/forgotpassword/change", {
        state: { resetJwt, email },
      });
    } catch (err) {
      setError(err.message || "Token tidak valid atau sudah kadaluarsa.");
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
                  n <= 2
                    ? "bg-[#6379F4] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {n < 2 ? (
                  // Completed step: checkmark
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
          <span className="ml-2 text-xs text-gray-400">Enter Token</span>
        </div>

        <LoginHeadline
          title="Check Your Email 📬"
          text={
            email
              ? `We sent a reset token to ${email}. Paste it below.`
              : "Paste the reset token from your email or SMS below."
          }
        />

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="ml-1 block text-sm font-bold text-[#3A3D42]">
              Reset Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => { setToken(e.target.value); setError(""); }}
              placeholder="Paste your reset token here"
              className="w-full rounded-2xl border border-transparent bg-slate-50 px-4 py-4 text-sm text-[#3A3D42] outline-none transition-all placeholder:text-slate-300 focus:border-[#6379F4] focus:bg-white"
              autoComplete="one-time-code"
            />
            <p className="ml-1 text-xs text-gray-400">
              Token expires in 5 minutes. Check spam if you don't see it.
            </p>
          </div>

          <Submit name={loading ? "Verifying..." : "Verify Token"} disabled={loading} />
        </form>

        <LoginSubtext
          text="Didn't receive a token? "
          link="/forgotpassword"
          linklabel="Try again"
        />
      </section>
    </main>
  );
}
