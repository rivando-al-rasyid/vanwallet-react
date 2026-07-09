import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../../store/slices/authSlice";
import Brand from "../Brand";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    const shouldLogout = window.confirm("Are you sure you want to logout?");
    if (!shouldLogout) return;

    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 border-base-300 min-h-16 shrink-0 border-b px-3 sm:px-5 lg:px-8">
      <div className="navbar-start gap-2">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-ghost btn-square lg:hidden"
          aria-label="Open sidebar"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </label>
        <Brand />
      </div>

      <div className="navbar-end gap-2">
        <button
          className="btn btn-ghost btn-square hidden xl:inline-flex"
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

        {user ? (
          <div className="dropdown dropdown-end hidden lg:block">
            <div
              tabIndex={0}
              role="button"
              className="border-base-300 hover:border-primary/40 hover:bg-primary/10 flex max-w-56 items-center gap-3 rounded-field border p-1.5 pr-3 transition-all"
            >
              <img
                src={user.avatar}
                className="ring-base-100 h-9 w-9 shrink-0 rounded-xl object-cover shadow-sm ring-2"
                alt="avatar"
              />
              <span className="text-base-content/80 truncate text-sm font-bold">
                {user.name}
              </span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box border-base-300 z-50 mt-3 w-64 border p-2 shadow-lg"
            >
              <li className="menu-title">Akun Tersambung</li>
              <li>
                <button onClick={() => navigate("/dashboard/profile")}>
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
              </li>
              <li>
                <LogoutButton onLogout={handleLogout} className="btn-ghost" />
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary btn-sm hidden rounded-field px-6 font-black lg:flex"
          >
            Masuk
          </button>
        )}
      </div>
    </div>
  );
}
