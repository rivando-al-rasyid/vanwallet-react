import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
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
      setError("Token wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const response = await confirmPasswordReset(token.trim());
      navigate("/forgotpassword/change", { state: { resetJwt: response?.resetToken || response?.token || response?.jwt } });
    } catch (err) {
      setError(err.message || "Token tidak valid atau sudah kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-base-200 px-5 py-10">
      <section className="w-full max-w-xl rounded-[2rem] border border-base-300 bg-base-100/90 p-6 shadow-2xl shadow-base-content/10 sm:p-10">
        <Brand />
        <div className="mt-10">
          <div className="mb-6 flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${n <= 2 ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/50"}`}>{n < 2 ? "✓" : n}</div>
                {n < 3 && <div className="h-px w-8 bg-base-300" />}
              </div>
            ))}
            <span className="ml-2 text-xs font-bold text-base-content/50">Enter Token</span>
          </div>
          <LoginHeadline title="Check your email 📬" text={email ? `We sent a reset token to ${email}. Paste it below.` : "Paste the reset token from your email below."} />
          {error && <div className="mb-4 rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-bold text-error">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="ml-1 block text-sm font-bold text-base-content/80">Reset Token</label>
              <input type="text" value={token} onChange={(e) => { setToken(e.target.value); setError(""); }} placeholder="Paste your reset token here" className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-4 text-sm text-base-content shadow-sm outline-none transition placeholder:text-base-content/50 focus:border-primary focus:ring-4 focus:ring-primary/20" autoComplete="one-time-code" />
              <p className="ml-1 text-xs text-base-content/50">Token expires in 5 minutes. Check spam if you do not see it.</p>
            </div>
            <Submit name={loading ? "Verifying..." : "Verify Token"} disabled={loading} />
          </form>
          <LoginSubtext text="Didn't receive a token? " link="/forgotpassword" linklabel="Try again" />
        </div>
      </section>
    </main>
  );
}
