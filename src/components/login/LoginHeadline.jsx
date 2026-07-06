import { memo } from "react";

const LoginHeadline = memo(function LoginHeadline({ title, text }) {
  return (
    <div className="mb-8">
      <span className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-wide">
        Secure wallet access
      </span>
      <h2 className="text-base-content mb-4 text-2xl leading-tight font-black sm:text-3xl">
        {title}
      </h2>
      <p className="text-base-content/65 max-w-lg text-sm leading-relaxed sm:text-base">
        {text}
      </p>
    </div>
  );
});

export default LoginHeadline;
