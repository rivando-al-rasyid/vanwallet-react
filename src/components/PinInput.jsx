import { useRef } from "react";
import { PIN_LENGTH } from "../schemas/pinSchema";
const BASE_INPUT_CLASSES = `
  w-10 sm:w-12
  text-center
  text-2xl font-semibold
  bg-transparent
  border-b-2
  outline-none
  transition
`;

export default function PinInput({
  value = [],
  onChange,
  length = PIN_LENGTH,
  type = "password",
  ariaLabelPrefix = "PIN digit",
  autoComplete = "off",
  onComplete,
}) {
  const inputsRef = useRef([]);
  const values = value;

  const handleChange = (e, index) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    const nextDigit = numericValue.slice(-1);

    const nextValues = values.map((item, currentIndex) =>
      currentIndex === index ? { ...item, value: nextDigit } : item,
    );
    onChange(nextValues);

    const isFilled = nextValues.length === length
      && nextValues.every((item) => String(item?.value || "").length === 1);
    if (onComplete && isFilled) {
      onComplete(nextValues.map((item) => item.value).join(""), nextValues);
    }

    // Auto-focus next input
    if (nextDigit && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !values?.[index]?.value) {
      if (inputsRef.current[index - 1]) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const getInputClassName = (isActive) => {
    const activeClasses = isActive ? "border-blue-500" : "border-gray-300";
    return `${BASE_INPUT_CLASSES} ${activeClasses} focus:border-blue-500`;
  };

  return (
    <div className="flex justify-between gap-4">
      {Array.from({ length }).map((_, index) => {
        const isActive = values?.[index]?.value;

        return (
          <PinInputField
            key={index}
            index={index}
            value={values?.[index]?.value || ""}
            isActive={isActive}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            inputRef={(el) => (inputsRef.current[index] = el)}
            className={getInputClassName(isActive)}
            type={type}
            ariaLabelPrefix={ariaLabelPrefix}
            autoComplete={index === 0 ? autoComplete : "off"}
          />
        );
      })}
    </div>
  );
}

function PinInputField({
  index,
  value,
  onChange,
  onKeyDown,
  inputRef,
  className,
  type,
  ariaLabelPrefix,
  autoComplete,
}) {
  return (
    <input
      type={type}
      maxLength={1}
      inputMode="numeric"
      value={value}
      ref={inputRef}
      onChange={(e) => onChange(e, index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      className={className}
      aria-label={`${ariaLabelPrefix} ${index + 1}`}
      autoComplete={autoComplete}
    />
  );
}
