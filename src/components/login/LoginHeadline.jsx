import { memo } from "react";

/**
 * Renders the heading and sub-description for login/signup screens.
 * @param {Object} props
 * @param {string} props.title - The bold main heading text.
 * @param {string} props.text - The supporting description text below the title.
 */
const LoginHeadline = memo(function LoginHeadline({ title, text }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-extrabold text-[#3A3D42] leading-tight mb-4">
        {title}
      </h2>
      <p className="text-base text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
});

export default LoginHeadline;
