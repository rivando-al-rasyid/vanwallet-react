export default function LoginSubtext({ text, linklabel, link }) {
  return (
    <p className="text-center text-sm text-slate-400 mt-8 font-medium">
      {text}{" "}
      <a href={link} className="text-[#6379F4] hover:underline font-bold">
        {linklabel}
      </a>
    </p>
  );
}
