import { memo } from "react";

const LoginHeadline = memo(function LoginHeadline({ title, text }) {
  return (
    <div className="mb-8">
      <span className="mb-4 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-700">
        Secure wallet access
      </span>
      <h2 className="mb-4 text-2xl leading-tight font-black text-slate-950 sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">{text}</p>
    </div>
  );
});

export default LoginHeadline;
