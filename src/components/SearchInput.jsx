import { useState, useEffect, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

/**
 * @typedef {Object} SearchInputProps
 * @property {string|number} value - Current search value
 * @property {(event: {target: {value: string}}) => void} onChange - Change handler
 * @property {string} [placeholder="Enter Number Or Full Name"] - Input placeholder
 * @property {number} [debounceMs=300] - Debounce delay in milliseconds
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [disabled=false] - Whether input is disabled
 */

/**
 * A semantic search input component with debouncing support.
 * @type {React.FC<SearchInputProps>}
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "Enter Number Or Full Name",
  debounceMs = 300,
  className = "",
  disabled = false,
}) {
  const [localValue, setLocalValue] = useState(String(value || ""));

  // Update local value when prop value changes (e.g., from URL params)
  useEffect(() => {
    setLocalValue(String(value || ""));
  }, [value]);

  // Memoized synthetic event creator
  const createSyntheticEvent = useCallback((newValue) => ({
    target: { value: newValue }
  }), []);

  // Debounced onChange handler
  useEffect(() => {
    if (localValue === String(value || "")) return;

    const timer = setTimeout(() => {
      onChange(createSyntheticEvent(localValue));
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs, value, createSyntheticEvent]);

  const handleChange = useCallback((e) => {
    setLocalValue(e.target.value);
  }, []);

  const inputClassName = useMemo(() => {
    const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "";
    return `form-input pl-4 pr-10 ${disabledClasses} ${className}`.trim();
  }, [className, disabled]);

  return (
    <div role="search" className={`relative w-80 ${className}`}>
      <input
        type="search"
        placeholder={placeholder}
        className={inputClassName}
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        aria-label={placeholder}
        aria-disabled={disabled}
      />
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
          disabled ? "text-gray-300" : "text-gray-400"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
