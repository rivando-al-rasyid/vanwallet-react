import { useState } from "react";
import { useNavigate } from "react-router";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import { loginUser, saveSession } from "../../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email dan password tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(form);
      saveSession(data.token, form.email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-20 bg-white xl:rounded-r-[60px] shadow-2xl z-20">
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
        </div>
      </section>
      <LoginImage img="../../../src/assets/img/3d-hand-phone.png" />
    </main>
  );
}
