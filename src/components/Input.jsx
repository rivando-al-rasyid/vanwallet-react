import { memo, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const InputLabel = memo(({ htmlFor, label }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-bold text-[#3A3D42] ml-1 block"
  >
    {label}
  </label>
));

const InputIcon = memo(({ icon }) => (
  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6379F4] transition-colors">
    <FontAwesomeIcon icon={icon} />
  </div>
));

const InputField = memo(({ paddingClasses, className, ...props }) => (
  <input
    {...props}
    className={`w-full bg-slate-50 border border-transparent focus:bg-white text-sm text-[#3A3D42] py-4 rounded-2xl focus:border-[#6379F4] outline-none transition-all placeholder:text-slate-300 ${paddingClasses} ${className || ""}`}
  />
));

const Input = memo(function Input({
  label,
  type = "text",
  icon,
  placeholder,
  value,
  onChange,
  name,
  className = "",
  required = false, // Now configurable
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputId = name ? `input-${name}` : undefined;

  // Logic to prevent text overlap with icons/buttons
  const paddingClasses = `${icon ? "pl-12" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"}`;

  const handleToggle = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <InputLabel htmlFor={inputId} label={label} />}

      <div className="relative group">
        {icon && <InputIcon icon={icon} />}

        <InputField
          {...rest}
          id={inputId}
          name={name}
          required={required}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          paddingClasses={paddingClasses}
        />

        {isPassword && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#6379F4] focus:outline-none transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
    </div>
  );
});

export default Input;
