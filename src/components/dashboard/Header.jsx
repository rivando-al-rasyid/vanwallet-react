import Brand from "../Brand";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../../context/auth/context";
import DashboardContext from "../../context/dashboard/context";
import { Menu } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setSidebarOpen } = useContext(DashboardContext);

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
        <div className="flex items-center gap-4">
          {/* Hamburger — only shows on mobile, but header itself is hidden on mobile via DashboardProvider */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <Brand />
        </div>

        <div className="flex items-center gap-5">
          {user ? (
            <div className="relative" ref={wrapperRef}>
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
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-white bg-blue-600 px-6 py-2.5 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
            >
              Masuk
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
