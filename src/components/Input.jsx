import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * A reusable styled input component with an icon.
 * @param {Object} props
 * @param {string} props.label - The text displayed above the input.
 * @param {string} [props.type="text"] - The HTML input type (e.g., 'password', 'email').
 * @param {Object|string} props.icon - The FontAwesome icon object.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {string|number} props.value - The current value of the input.
 * @param {string} props.name - The name attribute for the input field.
 * @param {function(React.ChangeEvent<HTMLInputElement>): void} props.onChange
 * @param {string} [props.className] - Additional classes for the outer container.
 */
const Input = memo(function Input({
  label,
  type = "text",
  icon,
  placeholder,
  value,
  onChange,
  name,
  className = "",
}) {
  const inputId = name ? `input-${name}` : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-bold text-[#3A3D42] ml-1 block"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6379F4] transition-colors">
            <FontAwesomeIcon icon={icon} />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className={`w-full bg-slate-50 border border-transparent focus:bg-white text-sm text-[#3A3D42] ${icon ? "pl-12" : "pl-4"} pr-4 py-4 rounded-2xl focus:border-[#6379F4] outline-none transition-all placeholder:text-slate-300`}
        />
      </div>
    </div>
  );
});

export default Input;
