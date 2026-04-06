import { useRef, useCallback } from "react";

/**
 * A 6-digit PIN input component with auto-focus and paste support.
 * @param {Object} props
 * @param {string[]} props.pin - An array of 6 strings representing each digit.
 * @param {function(string[]): void} props.onChange - Callback triggered when the PIN array updates.
 */
export default function PinInput({ pin = Array(6).fill(""), onChange }) {
  const inputs = useRef([]);

  const handleChange = useCallback(
    (index, value) => {
      if (!/^\d?$/.test(value)) return;
      const newPin = [...pin];
      newPin[index] = value;
      onChange(newPin);
      if (value && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    },
    [pin, onChange],
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace" && !pin[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    },
    [pin],
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const digits = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (!digits) return;

      const newPin = [...pin];
      [...digits].forEach((char, i) => {
        if (i < 6) newPin[i] = char;
      });
      onChange(newPin);

      inputs.current[Math.min(digits.length, 5)]?.focus();
    },
    [pin, onChange],
  );

  return (
    <div className="flex justify-between gap-2 sm:gap-4">
      {pin.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="password"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`PIN digit ${i + 1}`}
          className="w-10 h-12 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-xl border-slate-200 focus:border-[#6379F4] focus:ring-1 focus:ring-[#6379F4] focus:outline-none transition-all bg-white text-[#3A3D42]"
        />
      ))}
    </div>
  );
}
