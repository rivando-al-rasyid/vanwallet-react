import { memo } from "react";

const Submit = memo(function Submit({ label, name, disabled = false }) {
  const text = label ?? name;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {text}
    </button>
  );
});

export default Submit;
