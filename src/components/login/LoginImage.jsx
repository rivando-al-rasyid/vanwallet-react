import { memo } from "react";

const LoginImage = memo(function LoginImage({
  img,
  alt = "Login illustration",
}) {
  return (
    <aside
      className="bg-neutral relative hidden min-h-screen overflow-hidden p-8 lg:flex lg:items-center lg:justify-center xl:p-10"
      aria-label="Decorative sidebar"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.55),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.45),transparent_35%)]" />
      <div className="border-neutral-content/20 bg-neutral-content/10 text-neutral-content relative z-10 max-w-lg rounded-[2rem] border p-8 shadow-2xl backdrop-blur-xl xl:p-10">
        <p className="text-success text-sm font-bold tracking-[0.25em] uppercase">
          Fast & secure
        </p>
        <h2 className="mt-4 text-3xl leading-tight font-black xl:text-4xl">
          Control your money from one clean dashboard.
        </h2>
        <p className="text-neutral-content/70 mt-4 text-sm leading-7">
          Transfer, top up, and track every transaction with a smoother wallet
          experience.
        </p>
        <img
          src={img}
          alt={alt}
          loading="lazy"
          className="mx-auto mt-10 h-auto w-4/5 object-contain drop-shadow-2xl"
        />
      </div>
    </aside>
  );
});

export default LoginImage;
