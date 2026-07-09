import { FormProvider, useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PinInput from "../../components/PinInput";
import LoginImage from "../../components/login/LoginImage";
import LoginHeadline from "../../components/login/LoginHeadline";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
import { AuthSplitLayout } from "../../layouts/AuthLayout";
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
  const methods = useForm({
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirectTo");
  const redirectTo =
    redirectParam?.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";

  if (!user) return <Navigate to="/login" replace />;
  if (user.pin) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (data) => {
    const pin = data.pin.map((item) => item.value).join("");
    if (pin.length !== PIN_LENGTH) {
      methods.setError("pin", {
        type: "manual",
        message: "Please complete the 6-digit PIN.",
      });
      return;
    }
    const result = await dispatch(createPin({ pin }));
    if (createPin.fulfilled.match(result))
      navigate(redirectTo, { replace: true });
  };

  const pinError = methods.formState.errors.pin?.message;

  return (
    <AuthSplitLayout aside={<LoginImage img={loginPhoneImage} />}>
      <LoginHeadline
        title="Create your PIN 🔐"
        text="Set a 6-digit PIN to secure transfers and wallet actions."
      />
      <FormProvider {...methods}>
        <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
          <PinInput autoComplete="new-password" />
          {(pinError || error) && (
            <div className="border-error/30 bg-error/10 text-error rounded-xl border px-3 py-2 text-xs font-bold">
              {pinError || error}
            </div>
          )}
          <Submit
            name={pinLoading ? "Saving..." : "Continue"}
            disabled={pinLoading}
          />
        </form>
      </FormProvider>
      <LoginSubtext
        text="Wrong account? "
        link="/login"
        linklabel="Back to Login"
      />
    </AuthSplitLayout>
  );
}
