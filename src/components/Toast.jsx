import { useEffect } from "react";
import { Icon } from "@iconify/react";

const TONE = {
  success: {
    bg: "bg-emerald-600",
    border: "border-emerald-700",
    icon: "lucide:circle-check",
    iconColor: "text-white",
    titleColor: "text-white",
    textColor: "text-emerald-50",
    title: "Berhasil",
  },
  error: {
    bg: "bg-red-600",
    border: "border-red-700",
    icon: "lucide:circle-x",
    iconColor: "text-white",
    titleColor: "text-white",
    textColor: "text-red-50",
    title: "Gagal",
  },
  info: {
    bg: "bg-blue-600",
    border: "border-blue-700",
    icon: "lucide:info",
    iconColor: "text-white",
    titleColor: "text-white",
    textColor: "text-blue-50",
    title: "Info",
  },
  warning: {
    bg: "bg-amber-500",
    border: "border-amber-600",
    icon: "lucide:triangle-alert",
    iconColor: "text-white",
    titleColor: "text-white",
    textColor: "text-amber-900", // Khusus amber, teks gelap seringkali lebih terbaca, tapi jika ingin putih tetap gunakan text-white
    title: "Peringatan",
  },
};

export default function Toast({
  open,
  message,
  type = "info",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose, open]);

  if (!open || !message) return null;

  const tone = TONE[type] || TONE.info;

  return (
    <div className="fixed top-5 right-5 z-[9999] pointer-events-none">
      <div
        className={`
          pointer-events-auto
          flex items-start gap-3
          ${tone.bg} ${tone.border}
          border rounded-2xl
          px-4 py-3.5
          shadow-xl shadow-black/10
          min-w-72 max-w-sm
          animate-[slideIn_0.25s_ease-out]
        `}
      >
        {/* Icon */}
        <div className={`mt-0.5 shrink-0 ${tone.iconColor}`}>
          <Icon icon={tone.icon} width={20} height={20} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${tone.titleColor}`}>
            {tone.title}
          </p>
          <p className={`text-sm mt-0.5 leading-snug ${tone.textColor}`}>
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="shrink-0 mt-0.5 text-slate-300 hover:text-slate-500 transition-colors"
          aria-label="Tutup notifikasi"
        >
          <Icon icon="lucide:x" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
