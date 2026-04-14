import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/auth/context";
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
  const { login, loading, error } = useContext(AuthContext);

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

    try {
      await login(form);
      navigate("/login/pin");
    } catch (err) {
      // Error is already set in context
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

          {(validationError || error) && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
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
