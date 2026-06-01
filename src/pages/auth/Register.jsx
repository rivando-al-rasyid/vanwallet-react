import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { register } from "../../store/slices/registerSlice";
import { registerSchema } from "../../schemas/authSchemas";
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
  const { loading, error: serverError } = useSelector((state) => state.register);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    const result = await dispatch(
      register({ email: data.email, password: data.password }),
    );
    if (register.fulfilled.match(result)) {
      navigate("/register/pin");
    }
  };

  // Show first Joi field error, or server error from Redux
  const fieldError =
    errors.email?.message ||
    errors.password?.message ||
    errors.confirmPassword?.message;
  const displayError = fieldError || serverError;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#2948FF] lg:grid-cols-2">
      <section className="auth-panel">
        <div className="w-full max-w-175">
          <Brand />
          <LoginHeadline
            title="Start Accessing Banking Needs With All Devices and All Platforms With 30.000+ Users"
            text="Transfering money is eassier than ever, you can access Zwallet wherever you are. Desktop, laptop, mobile phone? we cover all of that for you!"
          />
          <SocialLogin />

          {displayError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {displayError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              icon={faEnvelope}
              placeholder="Enter your email"
              {...registerField("email")}
            />
            <Input
              label="Password"
              type="password"
              icon={faLock}
              placeholder="Enter Your Password"
              {...registerField("password")}
            />
            <Input
              label="Confirm Password"
              type="password"
              icon={faLock}
              placeholder="Enter Your Password Again"
              {...registerField("confirmPassword")}
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
