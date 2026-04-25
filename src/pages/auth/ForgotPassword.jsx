import { useState } from "react";
import Joi from "joi";
import { useNavigate } from "react-router";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import { useToast } from "../../context/toast/provider";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
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

    const { error: validationError } = forgotSchema.validate({ email });
    if (validationError) {
      showToast(validationError.message, "error");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showToast("Link reset password telah dikirim ke email kamu.", "success");
      navigate("/login");
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            icon="lucide:mail"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Submit label={loading ? "Loading..." : "Submit"} disabled={loading} />
        </form>
      </section>
    </main>
  );
}
