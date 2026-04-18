import { FormProvider, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Joi from "joi";

import PinInput from "../../components/PinInput";
import Brand from "../../components/Brand";
import LoginImage from "../../components/login/LoginImage";
import LoginHeadline from "../../components/login/LoginHeadline";
import Submit from "../../components/Submit";
import { createPin } from "../../store/slices/registerSlice";
import walletHandImage from "../../assets/img/3d-hand-wallet.png";

const defaultPin = Array(6)
  .fill(null)
  .map(() => ({ value: "" }));

const pinSchema = Joi.object({
  pin: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().length(1).pattern(/^\d$/).required(),
      })
    )
    .length(6)
    .required(),
});

export default function RegisterPin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.profile.user?.id ?? null);
  const pinLoading = useSelector((state) => state.register.pinLoading);
  const pinError = useSelector((state) => state.register.pinError);

  const methods = useForm({
    resolver: joiResolver(pinSchema),
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const pin = data.pin.map((item) => item.value).join("");
    const result = await dispatch(createPin({ userId, pin }));

    if (createPin.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      <section className="auth-panel">
        <div className="w-full max-w-175">
          <Brand />
          <LoginHeadline
            title={"Buat PIN Kamu 🔐"}
            text={
              "Buat 6-digit PIN untuk mengamankan akses ke dompet digitalmu."
            }
          />

          <FormProvider {...methods}>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <PinInput />

              {methods.formState.errors.pin && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                  Harap lengkapi 6-digit PIN.
                </div>
              )}

              {pinError && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                  {pinError}
                </div>
              )}

              <Submit
                name={pinLoading ? "Menyimpan..." : "Buat PIN"}
                disabled={pinLoading}
              />
            </form>
          </FormProvider>
        </div>
      </section>

      <LoginImage img={walletHandImage} />
    </main>
  );
}
