import { memo } from "react";

const Submit = memo(function Submit({ label, name, disabled = false }) {
  const text = label ?? name;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn btn-primary btn-block"
    >
      {text}
    </button>
  );
});

export default Submit;
