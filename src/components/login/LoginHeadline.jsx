import { memo } from "react";

const LoginHeadline = memo(function LoginHeadline({ title, text }) {
  return (
    <div className="mb-8">
      <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wide text-primary">
        Secure wallet access
      </span>
      <h2 className="mb-4 text-2xl leading-tight font-black text-base-content sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-lg text-sm leading-relaxed text-base-content/65 sm:text-base">{text}</p>
    </div>
  );
});

export default LoginHeadline;
