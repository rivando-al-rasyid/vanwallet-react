import { Menu, X } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DashboardContext from "../../context/dashboard/context";
import { logout } from "../../store/slices/authSlice";
import Brand from "../Brand";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { sidebarOpen, setSidebarOpen } = useContext(DashboardContext);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const shouldLogout = window.confirm("Are you sure you want to logout?");
    if (!shouldLogout) return;
    await dispatch(logout());
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 font-sans shadow-sm backdrop-blur-xl">
      <nav className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 border-r border-slate-200 pr-4 lg:flex">
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600" aria-label="Search">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600" aria-label="Wallet">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            </button>
          </div>

          {user ? (
            <div className="relative hidden lg:block" ref={wrapperRef}>
              <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-3 rounded-2xl border border-transparent bg-slate-50 p-1.5 pr-3 transition-all hover:border-indigo-100 hover:bg-indigo-50">
                <img src={user.avatar} className="h-9 w-9 rounded-xl object-cover shadow-sm ring-2 ring-white" alt="avatar" />
                <span className="max-w-32 truncate text-sm font-bold text-slate-700">{user.name}</span>
                <svg className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className={`absolute top-[calc(100%+12px)] right-0 w-64 origin-top-right overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl transition-all duration-200 ${open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0"}`}>
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Akun Tersambung</p>
                  <p className="truncate text-sm font-black text-slate-800">{user.name}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => { navigate("/dashboard/profile"); setOpen(false); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Profil Saya
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <LogoutButton onLogout={handleLogout} className="w-full px-3 py-3" />
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="hidden rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-black text-white transition-all hover:bg-indigo-700 active:scale-95 lg:block">Masuk</button>
          )}

          <button onClick={() => setSidebarOpen((prev) => !prev)} className="flex items-center justify-center rounded-2xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden" aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
