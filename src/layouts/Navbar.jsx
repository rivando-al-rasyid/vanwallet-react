import { memo, useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import Brand from "../components/Brand";

const NAV_LINKS = [
  {
    to: "/login",
    label: "Sign In",
    className: "btn btn-ghost btn-sm rounded-field px-5 font-bold",
  },
  {
    to: "/register",
    label: "Create Wallet",
    className: "btn btn-primary btn-sm rounded-field px-5 font-black",
  },
];

const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-base-300/80 bg-base-100/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Brand />
        <div className="hidden items-center gap-3 sm:flex">
          {NAV_LINKS.map(({ to, label, className }) => (
            <NavLink key={to} to={to} className={className}>
              {label}
            </NavLink>
          ))}
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="btn btn-ghost btn-square rounded-field sm:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="border-base-300/80 bg-base-100 border-t sm:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            {NAV_LINKS.map(({ to, label, className }) => (
              <NavLink
                key={to}
                to={to}
                className={`${className} w-full`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;
