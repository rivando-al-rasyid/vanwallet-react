import { useCallback, useContext, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import ConfirmContext from "./context";

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Ya",
    cancelLabel: "Batal",
    variant: "danger", // "danger" | "warning" | "info"
  });

  const resolveRef = useRef(null);

  const confirm = useCallback(
    ({
      title = "Konfirmasi",
      message = "Apakah kamu yakin?",
      confirmLabel = "Ya",
      cancelLabel = "Batal",
      variant = "danger",
    } = {}) => {
      return new Promise((resolve) => {
        resolveRef.current = resolve;
        setDialog({ open: true, title, message, confirmLabel, cancelLabel, variant });
      });
    },
    []
  );

  const handleConfirm = () => {
    setDialog((prev) => ({ ...prev, open: false }));
    resolveRef.current?.(true);
  };

  const handleCancel = () => {
    setDialog((prev) => ({ ...prev, open: false }));
    resolveRef.current?.(false);
  };

  const variantStyles = {
    danger: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Icon icon="lucide:triangle-alert" width={24} height={24} color="#EF4444" aria-hidden="true" />
        </div>
      ),
      confirmBtn: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <Icon icon="lucide:info" width={24} height={24} color="#F59E0B" aria-hidden="true" />
        </div>
      ),
      confirmBtn: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    info: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Icon icon="lucide:info" width={24} height={24} color="#3B82F6" aria-hidden="true" />
        </div>
      ),
      confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  };

  const style = variantStyles[dialog.variant] ?? variantStyles.danger;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {dialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center animate-in fade-in zoom-in-95 duration-150">
            {style.icon}

            <h3 className="text-base font-bold text-gray-800 mb-2">
              {dialog.title}
            </h3>
            <p className="text-sm text-gray-500 mb-6">{dialog.message}</p>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                {dialog.cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition ${style.confirmBtn}`}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context)
    throw new Error("useConfirm harus dipakai di dalam ConfirmProvider");
  return context;
}
