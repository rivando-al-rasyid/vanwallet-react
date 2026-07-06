import { memo } from "react";

const Submit = memo(function Submit({ label, name, disabled = false }) {
  const text = label ?? name;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 w-full rounded-2xl bg-gradient-to-r px-6 py-4 text-base font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {text}
    </button>
  );
});

export default Submit;
