import { memo } from "react";

/**
 * Renders the company logo/brand mark.
 * @param {Object} props
 * @param {boolean} [props.isWhite=false] - If true, renders the light version of the brand.
 */
const Brand = memo(function Brand({ isWhite = false }) {
  return (
    <div className="flex gap-4 items-center group">
      <div
        className={`p-2 rounded-lg transition-colors ${
          isWhite
            ? "bg-white/20 group-hover:bg-white/40"
            : "bg-[#6379F415] group-hover:bg-[#6379F4]"
        }`}
      >
        <img
          src="/img/logo.png"
          alt="E-Wallet logo"
          className="w-6 h-6 object-contain"
        />
      </div>

      {/* Use <span> instead of <h1> — Brand appears in nav/header where
          only one h1 should exist (the page title). */}
      <span
        className={`text-2xl font-bold tracking-tight transition-colors ${
          isWhite ? "text-white" : "text-[#6379F4]"
        }`}
      >
        E-Wallet
      </span>
    </div>
  );
});

export default Brand;
