import { memo } from "react";
import logoImage from "../assets/img/logo.png";

const Brand = memo(function Brand({ isWhite = false }) {
  return (
    <div className="group flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-all ${
          isWhite
            ? "border-white/20 bg-white/15 shadow-black/10 group-hover:bg-white/25"
            : "border-indigo-100 bg-gradient-to-br from-indigo-50 to-emerald-50 shadow-indigo-100 group-hover:scale-105"
        }`}
      >
        <img src={logoImage} alt="E-Wallet logo" className="h-6 w-6 object-contain" />
      </div>

      <span
        className={`text-2xl font-black tracking-tight ${
          isWhite ? "text-white" : "text-slate-950"
        }`}
      >
        E-Wallet
      </span>
    </div>
  );
});

export default Brand;
