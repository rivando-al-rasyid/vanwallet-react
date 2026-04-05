import { NavLink } from "react-router";
export default function LoginSubtext({ text, linklabel, link }) {
  return (
    <p className="text-center text-sm text-slate-400 mt-8 font-medium">
      {text}
      <NavLink className="text-[#6379F4] hover:underline font-bold" to={link}>
        {linklabel}
      </NavLink>
    </p>
  );
}
