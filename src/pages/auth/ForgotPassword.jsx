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
    <main className="grid min-h-screen place-items-center bg-base-200 px-5 py-10">
      <section className="w-full max-w-xl rounded-[2rem] border border-base-300 bg-base-100/90 p-6 shadow-2xl shadow-base-content/10 sm:p-10">
        <Brand />
        <div className="mt-10">
          <div className="mb-6 flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${n === 1 ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/50"}`}>{n}</div>
                {n < 3 && <div className="h-px w-8 bg-base-300" />}
              </div>
            ))}
            <span className="ml-2 text-xs font-bold text-base-content/50">Email</span>
          </div>
          <LoginHeadline title="Reset your password" text="Enter your email and we will send you a reset token." />
          {error && <div className="mb-4 rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm font-bold text-error">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Email" type="email" name="email" icon={faEnvelope} placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
            <Submit name={loading ? "Sending..." : "Send Reset Token"} disabled={loading} />
          </form>
          <LoginSubtext text="Remember your password? " link="/login" linklabel="Back to Login" />
        </div>
      </section>
    </main>
  );
}
