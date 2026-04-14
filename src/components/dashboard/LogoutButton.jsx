export default function LogoutButton({
  onLogout,
  className = "",
  iconClassName = "w-4 h-4",
  label = "Keluar",
}) {
  return (
    <button
      onClick={onLogout}
      className={`flex items-center gap-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors ${className}`}
    >
      <svg
        className={iconClassName}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="16 17 21 12 16 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  );
}
