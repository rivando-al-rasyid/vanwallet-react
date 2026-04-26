import { useCallback, useContext, useState } from "react";

import ToastContext from "./context";
import Toast from "../../components/Toast";

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({ open: true, message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useToast harus dipakai di dalam ToastProvider");
  return context;
}
