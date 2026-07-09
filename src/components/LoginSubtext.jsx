import { memo } from "react";
import { NavLink } from "react-router";

const LoginSubtext = memo(function LoginSubtext({ text, linklabel, link }) {
  return (
    <p className="text-base-content/65 mt-5 text-center text-xs font-medium sm:text-sm">
      {text}
      <NavLink className="link link-primary font-bold" to={link}>
        {linklabel}
      </NavLink>
    </p>
  );
});

export default LoginSubtext;
