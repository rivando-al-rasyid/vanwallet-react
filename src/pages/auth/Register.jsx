import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { register } from "../../store/slices/registerSlice";
import Joi from "joi";

import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import walletHandImage from "../../assets/img/3d-hand-wallet.png";
import { useToast } from "../../context/toast/provider";

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email tidak boleh kosong.",
      "string.email": "Format email tidak valid.",
      "any.required": "Email wajib diisi.",
    }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password tidak boleh kosong.",
    "string.min": "Password minimal 8 karakter.",
    "any.required": "Password wajib diisi.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Konfirmasi password tidak boleh kosong.",
    "any.only": "Password dan konfirmasi password tidak cocok.",
    "any.required": "Konfirmasi password wajib diisi.",
  }),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loading = useSelector((state) => state.register.registerLoading);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error: joiError } = registerSchema.validate(form, {
      abortEarly: true,
    });
    if (joiError) {
      showToast(joiError.message, "error");
      return;
    }

    const result = await dispatch(
      register({ email: form.email, password: form.password }),
    );

    if (register.fulfilled.match(result)) {
      showToast("Registrasi berhasil! Buat PIN kamu.", "success");
      navigate("/register/pin");
    } else {
      const msg =
        result.payload ||
        result.error?.message ||
        "Registrasi gagal. Coba lagi.";
      showToast(msg, "error");
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      <section className="auth-panel">
        <div className="w-full max-w-175">
          <Brand />
          <LoginHeadline
            title={
              "Start Accessing Banking Needs With All Devices and All Platforms With 30.000+ Users"
            }
            text={
              "Transfering money is eassier than ever, you can access Zwallet wherever you are. Desktop, laptop, mobile phone? we cover all of that for you!"
            }
          />
          <SocialLogin />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              icon="lucide:mail"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              icon="lucide:lock"
              placeholder="Enter Your Password"
              value={form.password}
              onChange={handleChange}
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              icon="lucide:lock"
              placeholder="Enter Your Password Again"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <Submit name={loading ? "Loading..." : "Register"} />
          </form>

          <LoginSubtext
            text={"Have An Account? "}
            link={"/login"}
            linklabel={"login"}
          />
        </div>
      </section>
      <LoginImage img={walletHandImage} />
    </main>
  );
}
