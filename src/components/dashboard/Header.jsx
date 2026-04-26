import Brand from "../Brand";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";

import DashboardContext from "../../context/dashboard/context";
import LogoutButton from "../ui/LogoutButton";
import { useLogout } from "../../hooks/useLogout";

export default function Header() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.profile.user);
  const avatarPath = useSelector((state) => state.profile.avatarPath);
  const displayAvatar = avatarPath || user?.avatar || null;
  const { sidebarOpen, setSidebarOpen } = useContext(DashboardContext);

  // Unified logout — just pass it directly, no wrapper
  const handleLogout = useLogout();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm font-sans">
      <nav className="flex items-center justify-between px-4 h-16 sm:px-6 lg:px-8">
        <Brand />

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-4 border-r border-slate-100 pr-4">
            <button className="text-slate-400 hover:text-blue-500 transition-colors">
              <Icon icon="lucide:search" className="w-5 h-5" aria-hidden="true" />
            </button>
            <button className="text-slate-400 hover:text-blue-500 transition-colors">
              <Icon icon="lucide:shopping-bag" className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

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
                  src={displayAvatar}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  alt="avatar"
                  onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=User&background=EBF4FF&color=7F9CF5"; }}
                />
                <Icon
                  icon="lucide:chevron-down"
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

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
                  <p className="text-sm font-bold text-slate-700 truncate">{user.name}</p>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => { navigate("/dashboard/profile"); setOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Icon icon="lucide:user" className="w-4 h-4" aria-hidden="true" />
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

          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen
              ? <Icon icon="lucide:x" width={22} height={22} />
              : <Icon icon="lucide:menu" width={22} height={22} />
            }
          </button>
        </div>
      </nav>
    </header>
  );
}
