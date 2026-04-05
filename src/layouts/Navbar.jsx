// Navbar.jsx
import Brand from "../components/Brand";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-blue-600">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        {/* Pass the dynamic prop here */}
        <Brand isWhite={true} />

        <div className="flex items-center gap-3">
          <button className="text-white hover:bg-white/10 px-5 py-2 rounded-md transition">
            Sign In
          </button>
          <button className="bg-white text-blue-600 px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
