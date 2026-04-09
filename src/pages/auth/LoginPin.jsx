import { useFormContext } from "react-hook-form";

export default function PinInput() {
  const { register, setValue, watch } = useFormContext();
  const pinValues = watch("pin");

  const handleInput = (e, index) => {
    const val = e.target.value.replace(/\D/g, ""); // Only digits
    if (!val) return;

    // Set the value in react-hook-form
    setValue(`pin.${index}.value`, val.slice(-1));

    // Auto-focus next input
    if (index < 5) {
      const nextField = document.querySelector(
        `input[name="pin.${index + 1}.value"]`,
      );
      nextField?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pinValues[index].value && index > 0) {
      const prevField = document.querySelector(
        `input[name="pin.${index - 1}.value"]`,
      );
      prevField?.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-4 justify-center">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          {...register(`pin.${index}.value`)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          onInput={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
        />
      ))}
    </div>
  );
}
