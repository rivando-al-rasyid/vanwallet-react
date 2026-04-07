import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Constants
const COLORS = {
  text: "#3A3D42",
  primary: "#6379F4",
  slate300: "text-slate-300",
};

const BASE_INPUT_CLASSES = `
  w-full bg-slate-50 
  border border-transparent 
  focus:bg-white 
  text-sm text-[#3A3D42] 
  pr-4 py-4 
  rounded-2xl 
  focus:border-[#6379F4] 
  outline-none 
  transition-all 
  placeholder:text-slate-300
`;

const LABEL_CLASSES = "text-sm font-bold text-[#3A3D42] ml-1 block";
const ICON_CLASSES = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6379F4] transition-colors";

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
  const paddingLeft = icon ? "pl-12" : "pl-4";
  const inputClassName = `${BASE_INPUT_CLASSES} ${paddingLeft}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <InputLabel htmlFor={inputId} label={label} />}
      
      <div className="relative group">
        {icon && <InputIcon icon={icon} />}
        <InputField
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClassName}
        />
      </div>
    </div>
  );
});

function InputLabel({ htmlFor, label }) {
  return (
    <label htmlFor={htmlFor} className={LABEL_CLASSES}>
      {label}
    </label>
  );
}

function InputIcon({ icon }) {
  return (
    <div className={ICON_CLASSES}>
      <FontAwesomeIcon icon={icon} />
    </div>
  );
}

function InputField({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  className,
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className={className}
    />
  );
}

export default Input;
