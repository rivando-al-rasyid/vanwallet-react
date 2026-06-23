import { memo } from "react";
import logoImage from "../assets/img/logo.png";

const Brand = memo(function Brand({ isWhite = false }) {
  return (
    <div className="group flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-all ${
          isWhite
            ? "border-neutral-content/20 bg-neutral-content/10 shadow-black/10 group-hover:bg-neutral-content/20"
            : "border-primary/20 bg-gradient-to-br from-primary/10 to-success/10 shadow-primary/10 group-hover:scale-105"
        }`}
      >
        <img src={logoImage} alt="E-Wallet logo" className="h-6 w-6 object-contain" />
      </div>

      <span
        className={`text-2xl font-black tracking-tight ${
          isWhite ? "text-neutral-content" : "text-base-content"
        }`}
      >
        E-Wallet
      </span>
    </div>
  );
});

export default Brand;
