import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { register } from "../../store/slices/registerSlice";

import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import walletHandImage from "../../assets/img/3d-hand-wallet.png";
import { useToast } from "../../context/toast/provider";
import { registerSchema } from "../../schemas/authSchemas";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loading = useSelector((state) => state.register.registerLoading);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formValues) => {
    const result = await dispatch(
      register({ email: formValues.email, password: formValues.password }),
    );

    if (register.fulfilled.match(result)) {
      showToast("Registrasi berhasil! Buat PIN kamu.", "success");
      navigate("/register/pin");
    } else {
      const msg =
        result.payload ||
        result.error?.message ||
        "Registrasi gagal. Coba lagi.";
      showToast(msg, "error");
    }
  };

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

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Email"
                    type="email"
                    icon="lucide:mail"
                    placeholder="Enter your email"
                    {...field}
                  />
                )}
              />
              {errors.email?.message && (
                <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Password"
                    type="password"
                    icon="lucide:lock"
                    placeholder="Enter Your Password"
                    {...field}
                  />
                )}
              />
              {errors.password?.message && (
                <p className="text-sm text-red-500 mt-1.5">{errors.password.message}</p>
              )}
            </div>
            <div>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Confirm Password"
                    type="password"
                    icon="lucide:lock"
                    placeholder="Enter Your Password Again"
                    {...field}
                  />
                )}
              />
              {errors.confirmPassword?.message && (
                <p className="text-sm text-red-500 mt-1.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Submit label={loading ? "Loading..." : "Register"} />
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
