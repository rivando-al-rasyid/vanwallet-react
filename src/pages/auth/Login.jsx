import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { login } from "../../store/slices/authSlice";
import Joi from "joi";

import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import loginPhoneImage from "../../assets/img/3d-hand-phone.png";
import { useToast } from "../../context/toast/provider";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loading = useSelector((state) => state.auth.loading);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loginSchema = Joi.object({
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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error: validationError } = loginSchema.validate(form, {
      abortEarly: true,
    });
    if (validationError) {
      showToast(validationError.message, "error");
      return;
    }

    const result = await dispatch(login(form));

    if (login.fulfilled.match(result)) {
      showToast("Login berhasil! Selamat datang.", "success");
      navigate("/dashboard/");
    } else {
      const msg =
        result.payload || result.error?.message || "Login gagal. Coba lagi.";
      showToast(msg, "error");
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      <section className="auth-panel">
        <div className="w-full max-w-175">
          <Brand />
          <LoginHeadline
            title={"Hello Welcome Back 👋"}
            text={
              "Fill out the form correctly or you can login with several options."
            }
          />
          <SocialLogin />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              icon={faEnvelope}
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              icon={faLock}
              placeholder="Enter Your Password"
              value={form.password}
              onChange={handleChange}
            />
            <Submit name={loading ? "Loading..." : "Login"} />
          </form>

          <LoginSubtext
            text={"Not Have An Account? "}
            link={"/register"}
            linklabel={"Register"}
          />
          <LoginSubtext
            text={"Forgot Password? "}
            link={"/forgotpassword"}
            linklabel={"reset"}
          />
        </div>
      </section>
      <LoginImage img={loginPhoneImage} />
    </main>
  );
}
