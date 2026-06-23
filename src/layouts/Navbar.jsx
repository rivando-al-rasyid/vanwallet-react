import { memo, useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import Brand from "../components/Brand";

const NAV_LINKS = [
  { to: "/login", label: "Sign In", className: "rounded-2xl px-5 py-2.5 text-sm font-bold text-white/85 transition hover:bg-white/10 hover:text-white" },
  { to: "/register", label: "Sign Up", className: "rounded-2xl bg-white px-5 py-2.5 text-sm font-black text-indigo-700 shadow-lg shadow-indigo-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-50" },
];

const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Brand isWhite />
        <div className="hidden items-center gap-3 sm:flex">
          {NAV_LINKS.map(({ to, label, className }) => (
            <NavLink key={to} to={to} className={className}>{label}</NavLink>
          ))}
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-center rounded-2xl p-2 text-white transition hover:bg-white/10 sm:hidden" aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950 sm:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            {NAV_LINKS.map(({ to, label, className }) => (
              <NavLink key={to} to={to} className={className} onClick={() => setIsMenuOpen(false)}>{label}</NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;
