export default function Modal({ open, children, panelClassName = "" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
