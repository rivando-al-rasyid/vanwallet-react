import { memo } from "react";
import { NavLink } from "react-router";

const LoginSubtext = memo(function LoginSubtext({ text, linklabel, link }) {
  return (
    <p className="mt-8 text-center text-sm font-medium text-slate-500">
      {text}
      <NavLink className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline" to={link}>
        {linklabel}
      </NavLink>
    </p>
  );
});

export default LoginSubtext;
