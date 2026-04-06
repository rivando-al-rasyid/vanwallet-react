import { useRef } from "react";

/**
 * PinInput — reusable 6-digit PIN input component.
 *
 * Props:
 *   pin       {string[]} — array of 6 digit strings (controlled)
 *   onChange  {function} — (newPin: string[]) => void
 */
export default function PinInput({ pin, onChange }) {
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    onChange(newPin);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newPin = [...pin];
    pasted.split("").forEach((char, i) => { newPin[i] = char; });
    onChange(newPin);
    const nextEmpty = Math.min(pasted.length, 5);
    inputs.current[nextEmpty]?.focus();
  };

  return (
    <div className="flex gap-3">
      {pin.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-12 h-14 text-center text-2xl font-bold border-b-2 border-gray-200 focus:border-[#2948FF] focus:outline-none transition-colors bg-transparent text-gray-800"
        />
      ))}
    </div>
  );
}
