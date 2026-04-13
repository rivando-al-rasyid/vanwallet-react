import { NavLink, useNavigate } from "react-router";
import { useEffect, useContext } from "react";
import AuthContext from "../../context/auth/context";
import { X } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
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
          <NavLink
            to="/dashboard/"
            className={navLinkClass}
            end
            onClick={() => setIsOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.92265 4.93523L6.4874 6.5M22 12C22 17.5229 17.5229 22 12 22C6.47715 22 2 17.5229 2 12H22ZM22 12H20H22ZM22 12C22 9.2418 20.8833 6.74435 19.0774 4.93523L22 12ZM2 12H4H2ZM2 12C2 9.24175 3.1167 6.74435 4.92265 4.93523L2 12ZM12 2V4V2ZM12 2C14.7646 2 17.2672 3.12189 19.0774 4.93523L12 2ZM12 2C9.2354 2 6.7328 3.12189 4.92265 4.93523L12 2ZM19.0774 4.93523L17.5126 6.5L19.0774 4.93523Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 10V16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.926 18.098C18.0976 20.4711 15.2273 22 11.9999 22C8.77248 22 5.90218 20.4711 4.07373 18.098C6.41033 16.7629 9.11603 16 11.9999 16C14.8837 16 17.5894 16.7629 19.926 18.098Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/transfer"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5039 2.07729C20.1889 1.87802 20.931 2.07025 21.434 2.58253C21.937 3.0938 22.123 3.83957 21.918 4.52999L20.669 8.73188C20.55 9.13144 20.1339 9.35789 19.7359 9.23913C19.3389 9.11936 19.1129 8.69867 19.2319 8.30012L20.481 4.09722C20.551 3.86171 20.4259 3.7027 20.3689 3.64533C20.3119 3.58696 20.1519 3.46014 19.9209 3.52758L3.82937 8.20652C3.57336 8.281 3.51736 8.49537 3.50536 8.58394C3.49436 8.6725 3.49036 8.89392 3.71837 9.03482L7.10449 11.1182C7.4575 11.3355 7.5695 11.8005 7.35249 12.1568C7.21149 12.3883 6.96548 12.5171 6.71247 12.5171C6.57947 12.5171 6.44446 12.4819 6.32246 12.4064L2.93634 10.3221C2.26532 9.90942 1.91331 9.16667 2.01831 8.38265C2.12331 7.59762 2.65833 6.97464 3.41336 6.75523L19.5039 2.07729ZM18.0282 12.3492C18.1482 11.9487 18.5652 11.7212 18.9622 11.842C19.3592 11.9618 19.5852 12.3824 19.4662 12.782L17.1441 20.596C16.9191 21.3519 16.2971 21.8833 15.5201 21.9829C15.4331 21.995 15.3471 22 15.2611 22C14.583 22 13.963 21.6518 13.602 21.0539L9.50187 14.2645C9.32286 13.9666 9.36786 13.5841 9.61287 13.3386L15.4341 7.48007C15.7271 7.18518 16.2011 7.18518 16.4941 7.48007C16.7871 7.77496 16.7871 8.25302 16.4941 8.54791L11.0899 13.9877L14.8841 20.2699C15.0221 20.4984 15.2391 20.4964 15.3291 20.4863C15.4171 20.4742 15.6301 20.4199 15.7061 20.1643L18.0282 12.3492Z"
                fill="currentColor"
              />
            </svg>
            Transfer
          </NavLink>

          <NavLink
            to="/dashboard/history"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M2.90918 3.36365V7H6.54556"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12C2 17.5229 6.47715 22 12 22C17.5229 22 22 17.5229 22 12C22 6.47715 17.5229 2 12 2C8.299 2 5.06755 4.01056 3.33839 6.99905"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0026 6L12.002 12.0044L16.2417 16.2441"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            History
          </NavLink>

          <NavLink
            to="/dashboard/topup"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
              <mask
                id="mask0_topup"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="6"
                width="20"
                height="15"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 6.79401H19.9996V20.538H0V6.79401Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_topup)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.565 20.538H4.435C1.99 20.538 0 18.549 0 16.103V11.228C0 8.78301 1.99 6.79401 4.435 6.79401H5.368C5.782 6.79401 6.118 7.13001 6.118 7.54401C6.118 7.95801 5.782 8.29401 5.368 8.29401H4.435C2.816 8.29401 1.5 9.61001 1.5 11.228V16.103C1.5 17.722 2.816 19.038 4.435 19.038H15.565C17.183 19.038 18.5 17.722 18.5 16.103V11.219C18.5 9.60601 17.188 8.29401 15.576 8.29401H14.633C14.219 8.29401 13.883 7.95801 13.883 7.54401C13.883 7.13001 14.219 6.79401 14.633 6.79401H15.576C18.015 6.79401 20 8.77901 20 11.219V16.103C20 18.549 18.01 20.538 15.565 20.538Z"
                  fill="currentColor"
                />
              </g>
              <mask
                id="mask1_topup"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x="9"
                y="0"
                width="2"
                height="14"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.24951 0H10.7495V13.5409H9.24951V0Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask1_topup)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.99951 13.5409C9.58551 13.5409 9.24951 13.2049 9.24951 12.7909V0.749908C9.24951 0.335908 9.58551 0 9.99951 0C10.4135 0 10.7495 0.335908 10.7495 0.749908V12.7909C10.7495 13.2049 10.4135 13.5409 9.99951 13.5409Z"
                  fill="currentColor"
                />
              </g>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.08471 4.42859C6.89371 4.42859 6.70171 4.35559 6.55571 4.20959C6.26271 3.91759 6.26071 3.44359 6.55371 3.14959L9.46871 0.221588C9.74971 -0.0614116 10.2497 -0.0614116 10.5307 0.221588L13.4467 3.14959C13.7387 3.44359 13.7377 3.91759 13.4447 4.20959C13.1507 4.50159 12.6767 4.50159 12.3847 4.20759L9.99971 1.81359L7.61571 4.20759C7.46971 4.35559 7.27671 4.42859 7.08471 4.42859Z"
                fill="currentColor"
              />
            </svg>
            Top Up
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.59151 15.2068C13.2805 15.2068 16.4335 15.7658 16.4335 17.9988C16.4335 20.2318 13.3015 20.8068 9.59151 20.8068C5.90151 20.8068 2.74951 20.2528 2.74951 18.0188C2.74951 15.7848 5.88051 15.2068 9.59151 15.2068Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.59157 12.0198C7.16957 12.0198 5.20557 10.0568 5.20557 7.63479C5.20557 5.21279 7.16957 3.24979 9.59157 3.24979C12.0126 3.24979 13.9766 5.21279 13.9766 7.63479C13.9856 10.0478 12.0356 12.0108 9.62257 12.0198H9.59157Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.4829 10.8816C18.0839 10.6566 19.3169 9.28259 19.3199 7.61959C19.3199 5.98059 18.1249 4.62059 16.5579 4.36359"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5952 14.7322C20.1462 14.9632 21.2292 15.5072 21.2292 16.6272C21.2292 17.3982 20.7192 17.8982 19.8952 18.2112"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Profile
          </NavLink>
        </nav>

        {/* Logout — pinned at bottom */}
        <div className="px-4 py-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="16 17 21 12 16 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
