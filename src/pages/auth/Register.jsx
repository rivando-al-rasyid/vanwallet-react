import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { register } from "../../store/slices/registerSlice";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import walletHandImage from "../../assets/img/3d-hand-wallet.png";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.register);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
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
    const result = await dispatch(register({ email: form.email, password: form.password }));
    if (register.fulfilled.match(result)) navigate("/register/pin");
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-100 lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl shadow-slate-200 backdrop-blur sm:p-10">
          <Brand />
          <div className="mt-10">
            <LoginHeadline title="Create your wallet account" text="Start managing transfers, top ups, and payments from one secure account." />
            <SocialLogin />
            {(validationError || error) && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{validationError || error}</div>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input label="Email" type="email" name="email" icon={faEnvelope} placeholder="Enter your email" value={form.email} onChange={handleChange} />
              <Input label="Password" type="password" name="password" icon={faLock} placeholder="Enter your password" value={form.password} onChange={handleChange} />
              <Input label="Confirm Password" type="password" name="confirmPassword" icon={faLock} placeholder="Enter your password again" value={form.confirmPassword} onChange={handleChange} />
              <Submit name={loading ? "Loading..." : "Register"} disabled={loading} />
            </form>
            <LoginSubtext text="Have An Account? " link="/login" linklabel="Login" />
          </div>
        </div>
      </section>
      <LoginImage img={walletHandImage} />
    </main>
  );
}
