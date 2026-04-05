// Navbar.jsx
import Brand from "../components/Brand";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-blue-600">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Brand />
        <div className="flex items-center gap-3">
          <button className="rounded-md border border-white/40 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10">
            Sign In
          </button>
          <button className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-gray-100">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
