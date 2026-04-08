import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

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

    setTimeout(() => {
      setLoading(false);
      navigate("/input-pin", { state: { email } });
    }, 500);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#2F55FF]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
        <section className="relative flex items-center justify-center px-6 py-10 lg:px-10 xl:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_55%_40%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_30%)]" />

          <div className="relative z-10 w-full max-w-95 rounded-[22px] bg-[#F5F5F7] p-8 shadow-[0_24px_70px_rgba(14,34,122,0.28)] sm:p-9">
            <span className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#3555F6]">
              <span className="text-base">👛</span>
              E-Wallet
            </span>

            <div className="mb-8 space-y-3">
              <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-[#151515]">
                Fill Out Form Correctly 👋
              </h1>
              <p className="text-sm text-[#7E7E86]">
                We will send new password to your email
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-3">
                <span className="text-sm font-semibold text-[#2A2A2A]">
                  Email
                </span>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#E3E3E7] px-4 text-[#8E8E98] focus-within:border-[#3555F6] focus-within:ring-2 focus-within:ring-[#3555F6]/15">
                  <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-full w-full border-0 bg-transparent text-sm text-[#202020] outline-none placeholder:text-[#B2B2BA]"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#2F55FF] text-sm font-medium text-white transition hover:bg-[#2448ed] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </section>

        <aside className="relative hidden items-end justify-center overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_24%,rgba(255,255,255,0.2),transparent_18%),radial-gradient(circle_at_78%_50%,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_34%_72%,rgba(255,255,255,0.08),transparent_26%)]" />
          <img
            src="/img/character-laptop.png"
            alt="3D character holding a laptop"
            className="relative z-10 h-[80vh] max-h-190 w-auto object-contain xl:translate-x-10"
          />
        </aside>
      </div>
    </main>
  );
}
