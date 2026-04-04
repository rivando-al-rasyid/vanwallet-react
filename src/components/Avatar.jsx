export default function Avatar({ src, name, size = "md" }) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EBF4FF&color=3B82F6&bold=true`;
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
  };
  return (
    <div
      className={`${sizes[size]} rounded-xl overflow-hidden bg-blue-50 flex-shrink-0 ring-2 ring-white shadow-sm`}
    >
      <img
        src={src || fallback}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = fallback;
        }}
      />
    </div>
  );
}
