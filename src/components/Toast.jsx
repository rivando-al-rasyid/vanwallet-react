import { useEffect } from "react";

const toneMap = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-blue-600",
};

export default function Toast({
  open,
  message,
  type = "info",
  onClose,
  duration = 2500,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose, open]);

  if (!open || !message) return null;

  return (
    <div className="fixed top-4 right-4 z-60">
      <div
        className={`min-w-64 max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${toneMap[type] || toneMap.info}`}
      >
        {message}
      </div>
    </div>
  );
}
