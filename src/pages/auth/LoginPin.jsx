import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

import LoginHeadline from "../../components/LoginHeadline";
import Brand from "../../components/Brand";
import PinInput from "../../components/PinInput";
import LoginSubtext from "../../components/LoginSubtext";
import Submit from "../../components/Submit";

// useFieldArray requires array of objects, not primitives
const defaultPin = Array(6)
  .fill(null)
  .map(() => ({ value: "" }));

const pinSchema = Joi.object({
  pin: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().length(1).pattern(/^\d$/).required(),
      }),
    )
    .length(6)
    .required(),
});

export default function LoginPin() {
  const methods = useForm({
    resolver: joiResolver(pinSchema),
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });

  const onSubmit = (data) => {
    const finalPin = data.pin.map((item) => item.value).join("");
    console.log("Submitting PIN:", finalPin);
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-20 bg-white xl:rounded-r-[60px] shadow-2xl z-20">
        <div className="w-full max-w-175">
          <Brand />
          <LoginHeadline
            title={"Enter Your Pin 👋"}
            text={"Please save your pin because this so important."}
          />
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full max-w-175 flex flex-col items-center"
          >
            <PinInput />

            {methods.formState.errors.pin && (
              <p className="text-red-500 text-sm mt-2 font-medium">
                Please complete the 6-digit PIN.
              </p>
            )}

            <LoginSubtext
              text={"Forgot Your Pin?"}
              linklabel={"reset"}
              link={"#"}
            />

            <Submit name={"Confirm"} />
          </form>
        </FormProvider>
      </section>

      <aside className="flex flex-col-reverse items-center">
        <img
          src={"/img/person.png"}
          alt="illustration"
          loading="lazy"
          className="w-3/5 h-auto drop-shadow-2xl"
        />
      </aside>
    </main>
  );
}
