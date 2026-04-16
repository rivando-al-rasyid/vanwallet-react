import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { register } from "../../store/slices/authSlice";

import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import walletHandImage from "../../assets/img/3d-hand-wallet.png";

export default function Register() {
  const selectAuthLoading = (state) => state.auth.loading;
  const selectAuthError = (state) => state.auth.error;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!form.email || !form.password || !form.confirmPassword) {
      setValidationError("Semua field harus diisi.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    const result = await dispatch(
      register({ email: form.email, password: form.password }),
    );

    if (register.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const error = validationError || apiError;

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
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              icon={faLock}
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
