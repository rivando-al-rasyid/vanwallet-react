import { useRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

export default function PinInput() {
  const { control, setValue, watch } = useFormContext();

  // fields is now an array of objects: [{ id, value }, ...]
  const { fields } = useFieldArray({ control, name: "pin" });

  const inputs = useRef([]);
  const pinValues = watch("pin"); // [{ value: "1" }, { value: "" }, ...]

  const handleChange = (index, raw) => {
    // Only allow a single digit or empty
    const digit = raw.replace(/\D/g, "").slice(-1);
    setValue(`pin.${index}.value`, digit, { shouldValidate: true });

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pinValues?.[index]?.value && index > 0) {
      // Clear previous field and move focus back
      setValue(`pin.${index - 1}.value`, "", { shouldValidate: true });
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    pastedData.split("").forEach((char, i) => {
      setValue(`pin.${i}.value`, char, { shouldValidate: true });
    });

    const nextIndex = Math.min(pastedData.length, 5);
    inputs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-4">
      {fields.map((field, i) => (
        <input
          key={field.id}
          ref={(el) => (inputs.current[i] = el)}
          value={pinValues?.[i]?.value ?? ""}
          type="password"
          inputMode="numeric"
          maxLength={1}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-10 h-12 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-xl border-slate-200 focus:border-[#6379F4] focus:outline-none transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
        />
      ))}
    </div>
  );
}
