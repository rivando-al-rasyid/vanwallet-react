export default function Modal({ open, children, panelClassName = "" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-[2rem] border border-white/60 bg-white p-8 text-center shadow-2xl ${panelClassName}`}>
        {children}
      </div>
    </div>
  );
}
