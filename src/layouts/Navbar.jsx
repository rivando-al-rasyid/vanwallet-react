import { memo, useState } from "react";
import Brand from "../components/Brand";
import { NavLink } from "react-router";
import { Icon } from "@iconify/react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-blue-600">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        <Brand isWhite />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 sm:flex">
          {NAV_LINKS.map(({ to, label, className }) => (
            <NavLink key={to} to={to} className={className}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center rounded-lg p-2 text-white transition hover:bg-white/10 sm:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen
            ? <Icon icon="lucide:x" width={24} height={24} />
            : <Icon icon="lucide:menu" width={24} height={24} />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-white/20 bg-blue-600 sm:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map(({ to, label, className }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={className}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;
