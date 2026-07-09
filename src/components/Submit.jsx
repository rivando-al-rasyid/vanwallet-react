import { memo } from "react";

const Submit = memo(function Submit({ label, name, disabled = false }) {
  const text = label ?? name;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="bg-primary text-primary-content w-full rounded-xl px-6 py-3 text-sm font-bold shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {text}
    </button>
  );
});

export default Submit;
