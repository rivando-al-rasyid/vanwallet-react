import { memo } from "react";

/**
 * A full-width submit button for forms.
 * @param {object} props
 * @param {string} props.label - Button label text.
 * @param {boolean} [props.disabled=false] - Disables the button when true.
 */
const Submit = memo(function Submit({ label, name, disabled = false }) {
  // Accept both `label` (preferred) and legacy `name` prop
  const text = label ?? name;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full py-4 px-6 text-base font-bold rounded-2xl text-white bg-[#6379F4] hover:bg-[#4d61da] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-[#6379f430] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {text}
    </button>
  );
});

export default Submit;
