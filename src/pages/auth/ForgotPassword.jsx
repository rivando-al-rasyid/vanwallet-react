import { useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Brand from "../../components/Brand";
import LoginHeadline from "../../components/login/LoginHeadline";
import Input from "../../components/Input";
import Submit from "../../components/Submit";
import { useToast } from "../../context/toast/provider";
import { forgotPasswordSchema } from "../../schemas/authSchemas";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showToast("Link reset password telah dikirim ke email kamu.", "success");
      navigate("/login");
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#2948FF] flex items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 sm:p-10 shadow-xl">
        <Brand />
        <LoginHeadline
          title={"Fill Out Form Correctly 👋"}
          text={"We will send new password to your email"}
        />

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
          <Submit label={loading ? "Loading..." : "Submit"} disabled={loading} />
        </form>
      </section>
    </main>
  );
}
