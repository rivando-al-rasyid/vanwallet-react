import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { register } from "../../store/slices/registerSlice";
import LoginHeadline from "../../components/login/LoginHeadline";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import { AuthSplitLayout } from "../../layouts/AuthLayout";
import walletHandImage from "../../assets/img/3d-hand-wallet.png";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.register);
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
    if (register.fulfilled.match(result)) navigate("/register/pin");
  };

  return (
    <AuthSplitLayout aside={<LoginImage img={walletHandImage} />}>
      <LoginHeadline
        title="Create your wallet account"
        text="Start managing transfers, top ups, and payments from one account."
      />
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
        Secure account access · Email and password only
      </div>
      {(validationError || error) && (
        <div className="border-error/30 bg-error/10 text-error mb-3 rounded-xl border px-3 py-2 text-xs font-bold">
          {validationError || error}
        </div>
      )}
      <form className="space-y-3" onSubmit={handleSubmit}>
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
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          icon={faLock}
          placeholder="Enter your password again"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <Submit
          name={loading ? "Loading..." : "Register"}
          disabled={loading}
        />
      </form>
      <LoginSubtext text="Have An Account? " link="/login" linklabel="Login" />
    </AuthSplitLayout>
  );
}
