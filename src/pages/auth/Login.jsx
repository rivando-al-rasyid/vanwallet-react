import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { login } from "../../store/slices/authSlice";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import SocialLogin from "../../components/SocialLogin";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import LoginImage from "../../components/login/LoginImage";
import LoginSubtext from "../../components/LoginSubtext";
import loginPhoneImage from "../../assets/img/3d-hand-phone.png";
import { useToast } from "../../context/toast/provider";
import { loginSchema } from "../../schemas/authSchemas";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loading = useSelector((state) => state.auth.loading);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formValues) => {
    const result = await dispatch(login(formValues));

    if (login.fulfilled.match(result)) {
      showToast("Login berhasil! Selamat datang.", "success");
      navigate("/dashboard/");
    } else {
      const msg =
        result.payload || result.error?.message || "Login gagal. Coba lagi.";
      showToast(msg, "error");
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
            <Submit label={loading ? "Loading..." : "Login"} />
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
