import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { logout } from "../../store/slices/authSlice";
import LogoutButton from "./LogoutButton";

export default function Sidebar({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const shouldLogout = window.confirm("Are you sure you want to logout?");
    if (!shouldLogout) return;

    await dispatch(logout());
    setIsOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
      isActive
        ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
        : "text-base-content/65 hover:bg-primary/10 hover:text-primary"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="bg-base-100/70 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`border-base-300/80 bg-base-100/85 fixed top-16 right-0 z-50 flex h-[calc(100dvh-4rem)] w-[min(18rem,calc(100vw-1rem))] transform flex-col border-l shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out lg:sticky lg:top-16 lg:left-0 lg:z-auto lg:h-[calc(100dvh-4rem)] lg:w-64 lg:translate-x-0 lg:border-r lg:border-l-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-4 pt-5 sm:pt-6">
          <div className="rounded-box border border-base-300 bg-base-200 p-4">
            <p className="text-primary text-xs font-black tracking-[0.2em] uppercase">
              Wallet menu
            </p>
            <p className="text-base-content/65 mt-2 text-sm leading-6">
              Manage money with fast actions.
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5 sm:py-6">
          <NavLink
            to="/dashboard/"
            className={navLinkClass}
            end
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h7V3H3v9zM14 21h7v-9h-7v9zM14 3v5h7V3h-7zM3 21h7v-5H3v5z" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/transfer"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            Transfer
          </NavLink>
          <NavLink
            to="/dashboard/history"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 3v5h5" />
              <path d="M3.05 13A9 9 0 108 4.64" />
              <path d="M12 7v5l3 3" />
            </svg>
            History
          </NavLink>
          <NavLink
            to="/dashboard/topup"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
              <rect x="3" y="4" width="18" height="16" rx="3" />
            </svg>
            Top Up
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </NavLink>
        </nav>

        <div className="border-base-300 border-t px-4 py-5 lg:hidden">
          <LogoutButton
            onLogout={handleLogout}
            className="w-full px-4 py-3"
            iconClassName="h-5 w-5"
          />
        </div>
      </aside>
    </>
  );
}
