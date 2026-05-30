import { useState } from "react";
import { useNavigate } from "react-router";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import Input from "../../components/Input";
import Submit from "../../components/Submit";

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
      navigate("/login/pin", { state: { email } });
    }, 500);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#2948FF] px-6 py-10">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <Brand />
        <LoginHeadline
          title={"Fill Out Form Correctly 👋"}
          text={"We will send new password to your email"}
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
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Submit name={loading ? "Loading..." : "Submit"} disabled={loading} />
        </form>
      </section>
    </main>
  );
}
