import { memo } from "react";
import { NavLink } from "react-router";

const LoginSubtext = memo(function LoginSubtext({ text, linklabel, link }) {
  return (
    <p className="mt-8 text-center text-sm font-medium text-base-content/65">
      {text}
      <NavLink className="font-bold text-primary hover:text-primary hover:underline" to={link}>
        {linklabel}
      </NavLink>
    </p>
  );
});

export default LoginSubtext;
