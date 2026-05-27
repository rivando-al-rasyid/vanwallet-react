import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import PinInput from "../../components/PinInput";
import Brand from "../../components/Brand";
import LoginImage from "../../components/login/LoginImage";
import LoginHeadline from "../../components/login/LoginHeadline";
import Submit from "../../components/Submit";
import LoginSubtext from "../../components/LoginSubtext";
import { setPinApi, fetchUserInfo, mapUserFromInfo } from "../../utils/api";
import { mergeUser } from "../../store/store";
import loginPhoneImage from "../../assets/img/3d-hand-phone.png";

const PIN_LENGTH = 6;
const defaultPin = Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

export default function AskPin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const methods = useForm({
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const onSubmit = async (data) => {
    const pin = data.pin.map((item) => item.value).join("");
    if (pin.length !== PIN_LENGTH) {
      setError("Please complete the 6-digit PIN.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await setPinApi(pin);

      // Refresh user profile so user.pin is updated in Redux
      // before ProtectedRoute checks it
      const info = await fetchUserInfo();
      const updated = mapUserFromInfo(info, user.token);
      dispatch(mergeUser(updated));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to set PIN. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#2948FF] lg:grid-cols-2">
      <section className="auth-panel">
        <div className="w-full max-w-175">
          <Brand />
          <LoginHeadline
            title="Create Your PIN 🔐"
            text="Set a 6-digit PIN to secure your account."
          />

          <FormProvider {...methods}>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <PinInput />

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <Submit
                name={submitting ? "Saving..." : "Continue"}
                disabled={submitting}
              />
            </form>
          </FormProvider>

          <LoginSubtext
            text={"Wrong account? "}
            link={"/login"}
            linklabel={"Back to Login"}
          />
        </div>
      </section>

      <LoginImage img={loginPhoneImage} />
    </main>
  );
}
