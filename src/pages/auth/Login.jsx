import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
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

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirectTo");
  const redirectTo =
    redirectParam?.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";
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
        navigate(`/login/pin?redirectTo=${encodeURIComponent(redirectTo)}`, {
          replace: true,
        });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  };

  return (
    <main className="bg-base-200 grid min-h-screen grid-cols-1 overflow-x-hidden lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="border-base-300 bg-base-100/90 shadow-base-content/10 w-full max-w-xl rounded-[1.5rem] border p-5 shadow-2xl backdrop-blur sm:rounded-[2rem] sm:p-10">
          <Brand />
          <div className="mt-10">
            <LoginHeadline
              title="Welcome back 👋"
              text="Log in to manage your balance, transfers, top ups, and transaction history."
            />
            <SocialLogin />

            {passwordReset && (
              <div className="border-success/30 bg-success/10 text-success mb-4 rounded-2xl border px-4 py-3 text-sm font-bold">
                ✓ Password changed successfully. Please log in with your new
                password.
              </div>
            )}
            {(validationError || error) && (
              <div className="border-error/30 bg-error/10 text-error mb-4 rounded-2xl border px-4 py-3 text-sm font-bold">
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
              <div className="flex justify-end">
                <NavLink
                  to="/forgotpassword"
                  className="text-primary hover:text-primary text-sm font-bold hover:underline"
                >
                  Forgot Password?
                </NavLink>
              </div>
              <Submit
                name={loading ? "Loading..." : "Login"}
                disabled={loading}
              />
            </form>

            <LoginSubtext
              text="Not Have An Account? "
              link="/register"
              linklabel="Register"
            />
          </div>
        </div>
      </section>
      <LoginImage img={loginPhoneImage} />
    </main>
  );
}
