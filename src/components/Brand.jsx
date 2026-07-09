import { memo } from "react";
import logoImage from "../assets/img/logo.png";

const Brand = memo(function Brand({ isWhite = false }) {
  return (
    <div className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-all sm:h-9 sm:w-9 ${
          isWhite
            ? "border-neutral-content/20 bg-neutral-content/10 shadow-black/10 group-hover:bg-neutral-content/20"
            : "border-primary/30 bg-primary/15 shadow-primary/10 group-hover:scale-105 group-hover:bg-primary/25"
        }`}
      >
        <img
          src={logoImage}
          alt="VanWallet logo"
          className="h-4 w-4 object-contain sm:h-5 sm:w-5"
        />
      </div>

      <span
        className={`truncate text-lg font-black tracking-tight sm:text-xl ${
          isWhite ? "text-neutral-content" : "text-base-content"
        }`}
      >
        VanWallet
      </span>
    </div>
  );
});

export default Brand;
