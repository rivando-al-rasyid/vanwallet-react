import { memo } from "react";
import logoImage from "../assets/img/logo.png";

const Brand = memo(function Brand({ isWhite = false }) {
  return (
    <div className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-all sm:h-11 sm:w-11 ${
          isWhite
            ? "border-neutral-content/20 bg-neutral-content/10 group-hover:bg-neutral-content/20 shadow-black/10"
            : "border-primary/20 from-primary/10 to-success/10 shadow-primary/10 bg-gradient-to-br group-hover:scale-105"
        }`}
      >
        <img
          src={logoImage}
          alt="E-Wallet logo"
          className="h-5 w-5 object-contain sm:h-6 sm:w-6"
        />
      </div>

      <span
        className={`truncate text-xl font-black tracking-tight sm:text-2xl ${
          isWhite ? "text-neutral-content" : "text-base-content"
        }`}
      >
        E-Wallet
      </span>
    </div>
  );
});

export default Brand;
