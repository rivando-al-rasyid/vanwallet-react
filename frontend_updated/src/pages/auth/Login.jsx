import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
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
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Show success banner when redirected back from password-reset flow
  const passwordReset = location.state?.passwordReset === true;

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
      const user = result.payload;
      if (!user?.pin) {
        navigate("/login/pin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#2948FF] lg:grid-cols-2">
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

          {/* Password-reset success banner */}
          {passwordReset && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              ✓ Password changed successfully! Please log in with your new password.
            </div>
          )}

          {(validationError || error) && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {validationError || error}
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

            {/* Forgot password link */}
            <div className="flex justify-end">
              <NavLink
                to="/forgotpassword"
                className="text-sm font-semibold text-[#6379F4] hover:underline"
              >
                Forgot Password?
              </NavLink>
            </div>

            <Submit name={loading ? "Loading..." : "Login"} />
          </form>

          <LoginSubtext
            text={"Not Have An Account? "}
            link={"/register"}
            linklabel={"Register"}
          />
        </div>
      </section>
      <LoginImage img={loginPhoneImage} />
    </main>
  );
}
