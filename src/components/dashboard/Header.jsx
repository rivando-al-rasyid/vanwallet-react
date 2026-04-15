import Brand from "../Brand";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import DashboardContext from "../../context/dashboard/context";
import { X, Menu } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useLogout } from "../../hooks/useLogout";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useContext(DashboardContext);
  const logoutAndRedirect = useLogout();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutAndRedirect(() => setOpen(false));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm font-sans">
      <nav className="flex items-center justify-between px-4 h-16 sm:px-6 lg:px-8">
        {/* LEFT: Brand — always visible */}
        <Brand />

        {/* RIGHT side */}
        <div className="flex items-center gap-3">
          {/* Icon buttons — hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4 border-r border-slate-100 pr-4">
            <button className="text-slate-400 hover:text-blue-500 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button className="text-slate-400 hover:text-blue-500 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>
          </div>
          {/* User dropdown — hidden on mobile */}
          {user ? (
            <div className="relative hidden lg:block" ref={wrapperRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
              >
                <span className="text-sm font-medium text-slate-700 max-w-28 truncate">
                  {user.name}
                </span>
                <img
                  src={user.avatar}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  alt="avatar"
                />
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 top-[calc(100%+12px)] w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right ${
                  open
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Akun Tersambung
                  </p>
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {user.name}
                  </p>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => {
                      navigate("/dashboard/profile");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profil Saya
                  </button>

                  <hr className="my-1 border-slate-100" />

                  <LogoutButton
                    onLogout={handleLogout}
                    className="w-full px-3 py-2.5"
                  />
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden lg:block text-sm font-bold text-white bg-blue-600 px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all active:scale-95"
            >
              Masuk
            </button>
          )}
          {/* Hamburger — mobile only, on the RIGHT */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>{" "}
        </div>
      </nav>
    </header>
  );
}
