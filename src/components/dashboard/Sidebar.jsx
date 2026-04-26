import { NavLink } from "react-router";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import LogoutButton from "../ui/LogoutButton";
import { useLogout } from "../../hooks/useLogout";

export default function Sidebar({ isOpen, setIsOpen }) {
  // Unified logout — use directly, no wrapper
  const handleLogout = useLogout();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <>
      {/* Overlay — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 bg-white border-l border-slate-100
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:left-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-56
          lg:border-l-0 lg:border-r lg:border-slate-100
          lg:translate-x-0 lg:z-auto
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1 py-6 px-4 overflow-y-auto">
          <NavLink to="/dashboard/" className={navLinkClass} end onClick={() => setIsOpen(false)}>
            <Icon icon="lucide:gauge" width={24} height={24} aria-hidden="true" />
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/transfer" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Icon icon="lucide:send" width={24} height={24} aria-hidden="true" />
            Transfer
          </NavLink>
          <NavLink to="/dashboard/history" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Icon icon="lucide:history" width={24} height={24} aria-hidden="true" />
            History
          </NavLink>
          <NavLink to="/dashboard/topup" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Icon icon="lucide:upload" width={24} height={24} aria-hidden="true" />
            Top Up
          </NavLink>
          <NavLink to="/dashboard/profile" className={navLinkClass} onClick={() => setIsOpen(false)}>
            <Icon icon="lucide:users" width={24} height={24} aria-hidden="true" />
            Profile
          </NavLink>
        </nav>

        {/* Logout — pinned at bottom, mobile only */}
        <div className="px-4 py-6 border-t border-slate-100 lg:hidden">
          <LogoutButton
            onLogout={handleLogout}
            className="w-full px-4 py-3"
            iconClassName="w-5 h-5"
          />
        </div>
      </aside>
    </>
  );
}
