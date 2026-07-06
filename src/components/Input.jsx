import { memo, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const InputLabel = memo(({ htmlFor, label }) => (
  <label
    htmlFor={htmlFor}
    className="text-base-content/80 ml-1 block text-sm font-bold"
  >
    {label}
  </label>
));

const InputIcon = memo(({ icon }) => (
  <div className="text-base-content/50 group-focus-within:text-primary absolute top-1/2 left-4 -translate-y-1/2 transition-colors">
    <FontAwesomeIcon icon={icon} />
  </div>
));

const InputField = memo(({ paddingClasses, className, ...props }) => (
  <input
    {...props}
    className={`border-base-300 bg-base-100/90 text-base-content placeholder:text-base-content/50 focus:border-primary focus:ring-primary/20 w-full rounded-2xl border py-4 text-sm shadow-sm transition-all outline-none focus:ring-4 ${paddingClasses} ${className || ""}`}
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

  const isPinLike = /pin|otp|passcode/i.test(`${name || ""} ${label || ""}`);
  const isPassword = type === "password";
  const isSecret = isPassword || isPinLike;
  const canToggleVisibility = isPassword && !isPinLike;
  const inputId = name ? `input-${name}` : undefined;
  const paddingClasses = `${icon ? "pl-12" : "pl-4"} ${canToggleVisibility ? "pr-12" : "pr-4"}`;

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
          type={
            canToggleVisibility && showPassword
              ? "text"
              : isSecret
                ? "password"
                : type
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          paddingClasses={paddingClasses}
        />
        {canToggleVisibility && (
          <button
            type="button"
            onClick={handleToggle}
            className="text-base-content/50 hover:text-primary absolute top-1/2 right-4 -translate-y-1/2 transition-colors focus:outline-none"
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
