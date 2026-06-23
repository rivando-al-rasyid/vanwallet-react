import { useRef } from "react";
import { useFormContext } from "react-hook-form";

const PIN_LENGTH = 6;
const BASE_INPUT_CLASSES = "h-14 w-10 rounded-2xl border bg-white text-center text-2xl font-black text-slate-800 shadow-sm outline-none transition sm:w-12";

export default function PinInput() {
  const { setValue, watch } = useFormContext();
  const inputsRef = useRef([]);
  const values = watch("pin");

  const handleChange = (e, index) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    const nextDigit = numericValue.slice(-1);
    setValue(`pin.${index}.value`, nextDigit, { shouldDirty: true, shouldValidate: true });
    if (nextDigit && inputsRef.current[index + 1]) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !values?.[index]?.value && inputsRef.current[index - 1]) {
      inputsRef.current[index - 1].focus();
    }
  };

  const getInputClassName = (isActive) => `${BASE_INPUT_CLASSES} ${isActive ? "border-indigo-500 ring-4 ring-indigo-100" : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"}`;

  return (
    <div className="flex justify-between gap-2 sm:gap-4">
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
            inputMode="numeric"
            maxLength={1}
            aria-label={`PIN digit ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
