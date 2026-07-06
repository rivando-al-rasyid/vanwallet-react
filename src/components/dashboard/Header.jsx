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
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
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
    <header className="border-base-300 bg-base-100/90 fixed top-0 right-0 left-0 z-50 w-full border-b font-sans shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">
        <Brand />

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="border-base-300 hidden items-center gap-2 border-r pr-3 xl:flex">
            <button
              className="text-base-content/50 hover:bg-primary/10 hover:text-primary flex h-10 w-10 items-center justify-center rounded-2xl transition-colors"
              aria-label="Search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button
              className="text-base-content/50 hover:bg-primary/10 hover:text-primary flex h-10 w-10 items-center justify-center rounded-2xl transition-colors"
              aria-label="Wallet"
            >
              <svg
                className="h-5 w-5"
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

          {user ? (
            <div className="relative hidden lg:block" ref={wrapperRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="bg-base-200 hover:border-primary/20 hover:bg-primary/10 flex max-w-56 items-center gap-3 rounded-2xl border border-transparent p-1.5 pr-3 transition-all"
              >
                <img
                  src={user.avatar}
                  className="ring-base-100 h-9 w-9 shrink-0 rounded-xl object-cover shadow-sm ring-2"
                  alt="avatar"
                />
                <span className="text-base-content/80 truncate text-sm font-bold">
                  {user.name}
                </span>
                <svg
                  className={`text-base-content/50 h-4 w-4 shrink-0 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div
                className={`border-base-300 bg-base-100 absolute top-[calc(100%+12px)] right-0 w-64 origin-top-right overflow-hidden rounded-3xl border shadow-2xl transition-all duration-200 ${
                  open
                    ? "translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="border-base-300 bg-base-200 border-b px-4 py-4">
                  <p className="text-base-content/50 text-[10px] font-black tracking-widest uppercase">
                    Akun Tersambung
                  </p>
                  <p className="text-base-content truncate text-sm font-black">
                    {user.name}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/dashboard/profile");
                      setOpen(false);
                    }}
                    className="text-base-content/75 hover:bg-primary/10 hover:text-primary flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
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
                  <hr className="border-base-300 my-1" />
                  <LogoutButton
                    onLogout={handleLogout}
                    className="w-full px-3 py-3"
                  />
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-primary-content hover:bg-primary/90 hidden rounded-2xl px-6 py-2.5 text-sm font-black transition-all active:scale-95 lg:block"
            >
              Masuk
            </button>
          )}

          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="text-base-content/75 hover:bg-base-200 flex shrink-0 items-center justify-center rounded-2xl p-2 transition lg:hidden"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
