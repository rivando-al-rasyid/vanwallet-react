import { memo, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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

  const handleToggle = useCallback(() => setShowPassword((prev) => !prev), []);

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label pt-0 pb-1.5" htmlFor={inputId}>
          <span className="label-text text-xs font-bold sm:text-sm">
            {label}
          </span>
        </label>
      )}
      <label className="input input-bordered focus-within:input-primary flex w-full items-center gap-2.5">
        {icon && (
          <FontAwesomeIcon icon={icon} className="text-base-content/50" />
        )}
        <input
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
          className="grow"
        />
        {canToggleVisibility && (
          <button
            type="button"
            onClick={handleToggle}
            className="text-base-content/50 hover:text-primary transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </label>
    </div>
  );
});

export default Input;
