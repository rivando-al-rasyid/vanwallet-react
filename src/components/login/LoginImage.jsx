import { memo } from "react";

const LoginImage = memo(function LoginImage({
  img,
  alt = "Login illustration",
}) {
  return (
    <aside
      className="bg-neutral relative hidden h-dvh overflow-hidden lg:flex lg:items-center lg:justify-center lg:p-10"
      aria-label="Decorative sidebar"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--color-primary)_40%,transparent),transparent_45%),radial-gradient(circle_at_80%_80%,color-mix(in_oklch,var(--color-secondary)_32%,transparent),transparent_45%),linear-gradient(160deg,var(--color-neutral),color-mix(in_oklch,var(--color-neutral)_70%,black))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-neutral-content)_6%,transparent)_1px,transparent_1px)] bg-[length:26px_26px] opacity-40" />

      <img
        src={img}
        alt={alt}
        loading="lazy"
        className="relative z-10 h-auto max-h-[70dvh] w-full max-w-sm object-contain drop-shadow-2xl"
      />
    </aside>
  );
});

export default LoginImage;
