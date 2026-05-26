import { memo } from "react";
import { NavLink } from "react-router";

/**
 * Helper text displayed below a submit button, with a navigation link.
 * @param {object} props
 * @param {string} props.text - Plain text prefix (e.g. "Don't have an account? ").
 * @param {string} props.linklabel - Clickable link text.
 * @param {string} props.link - Route path for the link.
 */
const LoginSubtext = memo(function LoginSubtext({ text, linklabel, link }) {
  return (
    <p className="mt-8 text-center text-sm font-medium text-slate-400">
      {text}
      <NavLink className="font-bold text-[#6379F4] hover:underline" to={link}>
        {linklabel}
      </NavLink>
    </p>
  );
});

export default LoginSubtext;
