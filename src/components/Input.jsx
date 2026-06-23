import { memo, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const InputLabel = memo(({ htmlFor, label }) => (
  <label htmlFor={htmlFor} className="ml-1 block text-sm font-bold text-base-content/80">
    {label}
  </label>
));

const InputIcon = memo(({ icon }) => (
  <div className="absolute top-1/2 left-4 -translate-y-1/2 text-base-content/50 transition-colors group-focus-within:text-primary">
    <FontAwesomeIcon icon={icon} />
  </div>
));

const InputField = memo(({ paddingClasses, className, ...props }) => (
  <input
    {...props}
    className={`w-full rounded-2xl border border-base-300 bg-base-100/90 py-4 text-sm text-base-content shadow-sm transition-all outline-none placeholder:text-base-content/50 focus:border-primary focus:ring-4 focus:ring-primary/20 ${paddingClasses} ${className || ""}`}
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
  required = false,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputId = name ? `input-${name}` : undefined;
  const paddingClasses = `${icon ? "pl-12" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"}`;

  const handleToggle = useCallback(() => setShowPassword((prev) => !prev), []);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <InputLabel htmlFor={inputId} label={label} />}
      <div className="group relative">
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
            className="absolute top-1/2 right-4 -translate-y-1/2 text-base-content/50 transition-colors hover:text-primary focus:outline-none"
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
