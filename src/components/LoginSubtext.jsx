import { memo } from "react";
import { NavLink } from "react-router";

const LoginSubtext = memo(function LoginSubtext({ text, linklabel, link }) {
  return (
    <p className="text-base-content/65 mt-5 text-center text-xs font-medium sm:text-sm">
      {text}
      <NavLink
        className="text-primary hover:text-primary font-bold hover:underline"
        to={link}
      >
        {linklabel}
      </NavLink>
    </p>
  );
});

export default LoginSubtext;
