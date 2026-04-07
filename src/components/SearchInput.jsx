import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

/**
 * A semantic search input component with debouncing support.
 * @param {Object} props
 * @param {string|number} props.value
 * @param {function(React.ChangeEvent<HTMLInputElement>): void} props.onChange
 * @param {string} [props.placeholder="Enter Number Or Full Name"]
 * @param {number} [props.debounceMs=300] - Debounce delay in milliseconds
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "Enter Number Or Full Name",
  debounceMs = 300,
}) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop value changes (e.g., from URL params)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        // Create synthetic event to maintain API compatibility
        const syntheticEvent = {
          target: { value: localValue }
        };
        onChange(syntheticEvent);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs, value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  return (
    <div role="search" className="relative w-80">
      <input
        type="search"
        placeholder={placeholder}
        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
        value={localValue}
        onChange={handleChange}
        aria-label={placeholder}
      />
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
