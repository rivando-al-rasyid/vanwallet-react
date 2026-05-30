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
      className="w-full rounded-2xl bg-[#6379F4] px-6 py-4 text-base font-bold text-white shadow-xl shadow-[#6379f430] transition-all hover:-translate-y-0.5 hover:bg-[#4d61da] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {text}
    </button>
  );
});

export default Submit;
