import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { login } from "../../store/slices/authSlice";
import LoginHeadline from "../../components/login/LoginHeadline";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import { AuthLayout } from "../../layouts/AuthLayout";
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
    <AuthLayout aside={<LoginImage img={loginPhoneImage} />}>
      <LoginHeadline
        title="Welcome back 👋"
        text="Log in to manage your balance, transfers, top ups, and history."
      />
      <div role="alert" className="alert alert-info alert-soft mb-4 py-2 text-xs font-bold">
        Secure account access · Email and password only
      </div>

      {passwordReset && (
        <div
          role="alert"
          className="alert alert-success alert-soft mb-3 py-2 text-xs font-bold"
        >
          ✓ Password changed successfully. Please log in with your new
          password.
        </div>
      )}
      {(validationError || error) && (
        <div
          role="alert"
          className="alert alert-error alert-soft mb-3 py-2 text-xs font-bold"
        >
          {validationError || error}
        </div>
      )}

      <form className="space-y-3.5" onSubmit={handleSubmit}>
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
            className="link link-primary text-xs font-bold sm:text-sm"
          >
            Forgot Password?
          </NavLink>
        </div>
        <Submit name={loading ? "Loading..." : "Login"} disabled={loading} />
      </form>

      <LoginSubtext
        text="Not Have An Account? "
        link="/register"
        linklabel="Register"
      />
    </AuthLayout>
  );
}
