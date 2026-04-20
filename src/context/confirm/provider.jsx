import { useCallback, useContext, useRef, useState } from "react";
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

  // Store the resolve function from the Promise so we can call it later
  const resolveRef = useRef(null);

  /**
   * Opens the confirm dialog and returns a Promise<boolean>.
   * true  = user clicked confirm
   * false = user clicked cancel / closed
   */
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
      ),
      confirmBtn: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
      ),
      confirmBtn: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    info: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
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
