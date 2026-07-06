import { useRef } from "react";
import { useFormContext } from "react-hook-form";

const PIN_LENGTH = 6;
const BASE_INPUT_CLASSES =
  "h-12 w-[clamp(2rem,11vw,3rem)] rounded-2xl border bg-base-100 text-center text-xl font-black text-base-content shadow-sm outline-none transition [letter-spacing:0.2em] sm:h-14 sm:w-12 sm:text-2xl";

export default function PinInput({ autoComplete = "one-time-code" }) {
  const { setValue, watch } = useFormContext();
  const inputsRef = useRef([]);
  const values = watch("pin");

  const handleChange = (e, index) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    const nextDigit = numericValue.slice(-1);

    setValue(`pin.${index}.value`, nextDigit, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (nextDigit && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !values?.[index]?.value &&
      inputsRef.current[index - 1]
    ) {
      inputsRef.current[index - 1].focus();
    }
  };

  const getInputClassName = (isActive) =>
    `${BASE_INPUT_CLASSES} ${
      isActive
        ? "border-primary ring-4 ring-primary/20"
        : "border-base-300 focus:border-primary focus:ring-4 focus:ring-primary/20"
    }`;

  return (
    <div className="mx-auto flex w-full max-w-sm justify-center gap-1.5 sm:gap-3">
      {Array.from({ length: PIN_LENGTH }).map((_, index) => {
        const isActive = values?.[index]?.value;

        return (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            value={values?.[index]?.value || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={getInputClassName(isActive)}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete={autoComplete}
            aria-label={`PIN digit ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
