import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { logout } from "../../store/slices/authSlice";
import LogoutButton from "./LogoutButton";

const NAV_ITEMS = [
  {
    to: "/dashboard/",
    end: true,
    label: "Dashboard",
    path: "M3 12h7V3H3v9zM14 21h7v-9h-7v9zM14 3v5h7V3h-7zM3 21h7v-5H3v5z",
  },
  {
    to: "/dashboard/transfer",
    label: "Transfer",
    path: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
  },
  {
    to: "/dashboard/history",
    label: "History",
    path: "M3 3v5h5 M3.05 13A9 9 0 108 4.64 M12 7v5l3 3",
  },
  {
    to: "/dashboard/topup",
    label: "Top Up",
    path: "M12 5v14 M5 12h14",
    rect: true,
  },
  {
    to: "/dashboard/profile",
    label: "Profile",
    path: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
    circle: true,
  },
];

export default function Sidebar({ setIsOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const shouldLogout = window.confirm("Are you sure you want to logout?");
    if (!shouldLogout) return;

    await dispatch(logout());
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <aside className="bg-base-100 border-base-300 flex h-dvh w-72 flex-col border-r lg:w-64">
      <div className="px-3 pt-4">
        <div className="bg-base-200 rounded-box p-4">
          <p className="text-primary text-xs font-black tracking-[0.2em] uppercase">
            Wallet menu
          </p>
          <p className="text-base-content/65 mt-2 text-sm leading-6">
            Manage money with fast actions.
          </p>
        </div>
      </div>

      <ul className="menu w-full flex-1 flex-nowrap gap-1 overflow-y-auto px-3 py-4 text-sm font-bold">
        {NAV_ITEMS.map(({ to, end, label, path, rect, circle }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive ? "menu-active" : undefined
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {rect && <rect x="3" y="4" width="18" height="16" rx="3" />}
                {circle && <circle cx="12" cy="7" r="4" />}
                {path
                  .split(" M")
                  .map((d, i) => (i === 0 ? d : `M${d}`))
                  .map((d) => (
                    <path key={d} d={d} />
                  ))}
              </svg>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="border-base-300 border-t p-3 lg:hidden">
        <LogoutButton
          onLogout={handleLogout}
          className="btn btn-ghost btn-block justify-start"
        />
      </div>
    </aside>
  );
}
