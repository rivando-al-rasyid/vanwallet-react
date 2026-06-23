import { FormProvider, useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PinInput from "../../components/PinInput";
import Brand from "../../components/Brand";
import LoginImage from "../../components/login/LoginImage";
import LoginHeadline from "../../components/login/LoginHeadline";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
import { createPin } from "../../store/slices/registerSlice";
import loginPhoneImage from "../../assets/img/3d-hand-phone.png";

const PIN_LENGTH = 6;
const defaultPin = Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

export default function AskPin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { pinLoading, error } = useSelector((state) => state.register);
  const methods = useForm({ defaultValues: { pin: defaultPin }, mode: "onChange" });

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirectTo");
  const redirectTo = redirectParam?.startsWith("/") && !redirectParam.startsWith("//") ? redirectParam : "/dashboard";

  if (!user) return <Navigate to="/login" replace />;
  if (user.pin) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (data) => {
    const pin = data.pin.map((item) => item.value).join("");
    if (pin.length !== PIN_LENGTH) {
      methods.setError("pin", { type: "manual", message: "Please complete the 6-digit PIN." });
      return;
    }
    const result = await dispatch(createPin({ pin }));
    if (createPin.fulfilled.match(result)) navigate(redirectTo, { replace: true });
  };

  const pinError = methods.formState.errors.pin?.message;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-100 lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl shadow-slate-200 backdrop-blur sm:p-10">
          <Brand />
          <div className="mt-10">
            <LoginHeadline title="Create your PIN 🔐" text="Set a 6-digit PIN to secure transfers and wallet actions." />
            <FormProvider {...methods}>
              <form className="space-y-8" onSubmit={methods.handleSubmit(onSubmit)}>
                <PinInput />
                {(pinError || error) && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{pinError || error}</div>}
                <Submit name={pinLoading ? "Saving..." : "Continue"} disabled={pinLoading} />
              </form>
            </FormProvider>
            <LoginSubtext text="Wrong account? " link="/login" linklabel="Back to Login" />
          </div>
        </div>
      </section>
      <LoginImage img={loginPhoneImage} />
    </main>
  );
}
