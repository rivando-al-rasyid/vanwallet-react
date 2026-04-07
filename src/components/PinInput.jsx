import { useFormContext } from "react-hook-form";
import { useRef } from "react";

export default function PinInput() {
  const { setValue, watch } = useFormContext();
  const inputsRef = useRef([]);

  const values = watch("pin");

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    setValue(`pin.${index}.value`, value);

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !values?.[index]?.value) {
      if (inputsRef.current[index - 1]) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="flex justify-between gap-4">
      {Array.from({ length: 6 }).map((_, index) => {
        const isActive = values?.[index]?.value;

        return (
          <input
            key={index}
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={values?.[index]?.value || ""}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              w-10 sm:w-12
              text-center
              text-2xl font-semibold
              bg-transparent
              border-b-2
              outline-none
              transition
              ${isActive ? "border-blue-500" : "border-gray-300"}
              focus:border-blue-500
            `}
          />
        );
      })}
    </div>
  );
}
