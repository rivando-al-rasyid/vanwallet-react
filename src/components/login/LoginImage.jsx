import { memo } from "react";

const LoginImage = memo(function LoginImage({
  img,
  alt = "Login illustration",
}) {
  return (
    <aside
      className="relative hidden h-dvh overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-accent lg:flex lg:items-center lg:justify-center lg:p-10"
      aria-label="Decorative sidebar"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklch,white_8%,transparent)_1px,transparent_1px)] bg-[length:26px_26px] opacity-40" />

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
