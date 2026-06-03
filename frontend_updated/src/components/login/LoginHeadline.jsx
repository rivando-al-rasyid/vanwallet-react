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
      <h2 className="mb-4 text-2xl leading-tight font-extrabold text-[#3A3D42]">
        {title}
      </h2>
      <p className="text-base leading-relaxed text-slate-400">{text}</p>
    </div>
  );
});

export default LoginHeadline;
