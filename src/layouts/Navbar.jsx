import Brand from "../components/Brand";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  // 1. State Auth (Simulasi data user dari API/LocalStorage)
  const [user, setUser] = useState({
    name: "Alex Johansen",
    avatar: "https://i.pravatar.cc/32?img=12",
  });

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // 2. Fungsi Logout
  const handleLogout = () => {
    // Di sini kamu bisa hapus token dari localStorage/cookie
    // localStorage.removeItem("token");
    setUser(null);
    setOpen(false);
  };

  // 3. Menutup dropdown saat klik di luar area menu
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
    <header className="w-full bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50 font-sans">
      <nav className="flex items-center justify-between px-8 h-16">
        <Brand />

        <div className="flex items-center gap-5">
          {/* Search & Cart (Tampil hanya jika login atau sesuai kebutuhan) */}
          <div className="flex items-center gap-4 border-r border-slate-100 pr-4">
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

          {/* Logic Auth UI */}
          {user ? (
            <div className="relative" ref={wrapperRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
              >
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

              {/* Dropdown Panel */}
              <div
                className={`absolute right-0 top-[calc(100%+12px)] w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right
                ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
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
                  <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
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

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() =>
                setUser({
                  name: "Guest User",
                  avatar: "https://i.pravatar.cc/32?img=1",
                })
              } // Simulasi login
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
