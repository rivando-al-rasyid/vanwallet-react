import { memo } from "react";
import Brand from "../components/Brand";
import { NavLink } from "react-router";

const NAV_LINKS = [
  {
    to: "/login",
    label: "Sign In",
    className:
      "text-white hover:bg-white/10 px-5 py-2 rounded-md transition font-medium",
  },
  {
    to: "/register",
    label: "Sign Up",
    className:
      "bg-white text-blue-600 px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition",
  },
];

const Navbar = memo(function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-blue-600">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Brand isWhite />

        <div className="flex items-center gap-3">
          {NAV_LINKS.map(({ to, label, className }) => (
            // NavLink itself renders an <a> — wrapping it in <button> is invalid HTML.
            // Use NavLink directly with button-like styling instead.
            <NavLink key={to} to={to} className={className}>
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
