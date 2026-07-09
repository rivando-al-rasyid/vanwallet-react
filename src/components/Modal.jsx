export default function Modal({ open, children, panelClassName = "" }) {
  if (!open) return null;

  return (
    <div className="bg-base-content/60 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 backdrop-blur-sm sm:p-6">
      <div
        className={`border-base-300 bg-base-200/80 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-box border p-5 text-center shadow-2xl sm:rounded-box sm:p-8 ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
