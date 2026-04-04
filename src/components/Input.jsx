import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Input({
  label,
  type,
  icon,
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[#3A3D42] ml-1">{label}</label>

      <div className="relative group">
        {/* Icon Container */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6379F4] transition-colors">
          <FontAwesomeIcon icon={icon} />
        </div>

        {/* Input Field */}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-transparent focus:bg-white text-sm text-[#3A3D42] pl-12 pr-4 py-4 rounded-2xl focus:border-[#6379F4] outline-none transition-all placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}
