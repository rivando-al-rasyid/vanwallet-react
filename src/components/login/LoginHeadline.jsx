import { memo } from "react";

const LoginHeadline = memo(function LoginHeadline({ title, text }) {
  return (
    <div className="mb-4">
      <span className="badge badge-primary badge-outline mb-2.5 text-[11px] font-bold tracking-wide">
        Secure wallet access
      </span>
      <h2 className="text-base-content mb-2 text-xl leading-tight font-black sm:text-2xl">
        {title}
      </h2>
      <p className="text-base-content/65 max-w-lg text-xs leading-relaxed sm:text-sm">
        {text}
      </p>
    </div>
  );
});

export default LoginHeadline;
