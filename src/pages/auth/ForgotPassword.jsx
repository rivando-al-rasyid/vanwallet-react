import { useState } from "react";
import Joi from "joi";
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

  const forgotSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      "string.empty": "Email tidak boleh kosong.",
      "string.email": "Format email tidak valid.",
      "any.required": "Email wajib diisi.",
    }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { error: validationError } = forgotSchema.validate({ email });
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/login/pin", { state: { email } });
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#2948FF] flex items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 sm:p-10 shadow-xl">
        <Brand />
        <LoginHeadline
          title={"Fill Out Form Correctly 👋"}
          text={"We will send new password to your email"}
        />

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
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
