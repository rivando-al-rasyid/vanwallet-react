import { Icon } from "@iconify/react";

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
      <Icon
        icon="lucide:log-out"
        className={iconClassName}
        aria-hidden="true"
      />
      {label}
    </button>
  );
}
