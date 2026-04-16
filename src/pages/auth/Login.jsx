import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { login } from "../../store/slices/authSlice";

import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import loginPhoneImage from "../../assets/img/3d-hand-phone.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectAuthLoading = (state) => state.auth.loading;
  const selectAuthError = (state) => state.auth.error;

  const loading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);

  const [form, setForm] = useState({ email: "", password: "" });
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!form.email || !form.password) {
      setValidationError("Email dan password tidak boleh kosong.");
      return;
    }

    const result = await dispatch(login(form));

    if (login.fulfilled.match(result)) {
      navigate("/login/pin");
    }
  };

  const error = validationError || apiError;

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
