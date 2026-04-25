import { memo } from "react";

/**
 * Full-width submit button for auth forms.
 *
 * @param {object}  props
 * @param {string}  props.label       - Button label text.
 * @param {boolean} [props.disabled]  - Disables the button when true.
 */
const Submit = memo(function Submit({ label, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full py-4 px-6 text-base font-bold rounded-2xl text-white bg-[#6379F4] hover:bg-[#4d61da] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-[#6379f430] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {label}
    </button>
  );
});

export default Submit;
