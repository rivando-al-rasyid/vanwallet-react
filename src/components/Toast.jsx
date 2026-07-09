import { useEffect } from "react";

const toneMap = {
  success: "bg-emerald-600",
  error: "bg-rose-600",
  info: "bg-primary",
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
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`max-w-sm min-w-64 rounded-xl px-4 py-3 text-sm font-medium text-primary-content shadow-lg ${toneMap[type] || toneMap.info}`}
      >
        {message}
      </div>
    </div>
  );
}
