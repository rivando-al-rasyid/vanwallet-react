import { memo } from "react";

const LoginImage = memo(function LoginImage({ img, alt = "Login illustration" }) {
  return (
    <aside
      className="relative hidden min-h-screen overflow-hidden bg-slate-950 p-10 lg:flex lg:items-center lg:justify-center"
      aria-label="Decorative sidebar"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.55),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.45),transparent_35%)]" />
      <div className="relative z-10 max-w-lg rounded-[2rem] border border-white/10 bg-white/10 p-10 text-white shadow-2xl backdrop-blur-xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Fast & secure</p>
        <h2 className="mt-4 text-4xl font-black leading-tight">Control your money from one clean dashboard.</h2>
        <p className="mt-4 text-sm leading-7 text-white/70">
          Transfer, top up, and track every transaction with a smoother wallet experience.
        </p>
        <img src={img} alt={alt} loading="lazy" className="mx-auto mt-10 h-auto w-4/5 object-contain drop-shadow-2xl" />
      </div>
    </aside>
  );
});

export default LoginImage;
