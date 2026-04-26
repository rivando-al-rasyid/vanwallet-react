import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import PinInput from "../../components/PinInput";
import Brand from "../../components/Brand";
import LoginImage from "../../components/login/LoginImage";
import LoginHeadline from "../../components/login/LoginHeadline";
import Submit from "../../components/Submit";
import { createPin } from "../../store/slices/registerSlice";
import { DEFAULT_PIN_VALUE, pinFieldSchema } from "../../schemas/pinSchema";
import { useToast } from "../../context/toast/provider";
import walletHandImage from "../../assets/img/3d-hand-wallet.png";

export default function RegisterPin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const userId     = useSelector((state) => state.profile.user?.id ?? null);
  const pinLoading = useSelector((state) => state.register.pinLoading);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(pinFieldSchema),
    defaultValues: {
      pin: DEFAULT_PIN_VALUE,
    },
  });

  const onSubmit = async ({ pin }) => {
    const pinValue = pin.map((item) => item.value).join("");
    const result = await dispatch(createPin({ userId, pin: pinValue }));

    if (createPin.fulfilled.match(result)) {
      showToast("PIN berhasil dibuat! Selamat datang.", "success");
      navigate("/dashboard");
    } else {
      const msg =
        result.payload || result.error?.message || "Gagal membuat PIN. Coba lagi.";
      showToast(msg, "error");
    }
  };
  const pinErrorMessage = errors.pin?.message || errors.pin?.[0]?.value?.message;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      <section className="auth-panel">
        <div className="w-full max-w-175">
          <Brand />
          <LoginHeadline
            title="Buat PIN Kamu 🔐"
            text="Buat 6-digit PIN untuk mengamankan akses ke dompet digitalmu."
          />

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="pin"
              control={control}
              render={({ field }) => (
                <PinInput value={field.value} onChange={field.onChange} />
              )}
            />

            {pinErrorMessage && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                {pinErrorMessage}
              </div>
            )}

            <Submit
              label={pinLoading ? "Menyimpan..." : "Buat PIN"}
              disabled={pinLoading}
            />
          </form>
        </div>
      </section>

      <LoginImage img={walletHandImage} />
    </main>
  );
}
