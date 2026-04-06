import { useRef } from "react";

/**
 * A 6-digit PIN input component with auto-focus and paste support.
 * @param {Object} props
 * @param {string[]} props.pin - An array of 6 strings representing each digit.
 * @param {function(string[]): void} props.onChange - Callback triggered when the PIN array updates.
 */
export default function PinInput({ pin = Array(6).fill(""), onChange }) {
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    onChange(newPin);

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move focus back on backspace if current field is empty
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newPin = [...pin];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newPin[i] = char;
    });

    onChange(newPin);

    // Focus the last filled input or the first empty one
    const focusIndex = Math.min(pastedData.length, 5);
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-4">
      {pin.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text" // 'password' is fine, but 'text' with CSS 'text-security' is often preferred for PINs
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste} // Allow paste on any field for better UX
          className="w-10 h-12 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-xl border-slate-200 focus:border-[#6379F4] focus:ring-1 focus:ring-[#6379F4] focus:outline-none transition-all bg-white text-[#3A3D42]"
        />
      ))}
    </div>
  );
}
