import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Enter Number Or Full Name",
  debounceMs = 300,
  className = "",
  disabled = false,
}) {
  const [localValue, setLocalValue] = useState(String(value || ""));

  useEffect(() => {
    setLocalValue(String(value || ""));
  }, [value]);

  const createSyntheticEvent = useCallback((newValue) => ({ target: { value: newValue } }), []);

  useEffect(() => {
    if (localValue === String(value || "")) return;
    const timer = setTimeout(() => onChange(createSyntheticEvent(localValue)), debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs, value, createSyntheticEvent]);

  const inputClassName = useMemo(() => {
    const disabledClasses = disabled ? "cursor-not-allowed bg-slate-100 opacity-60" : "bg-white";
    return `w-full rounded-2xl border border-slate-200 py-3 pr-10 pl-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${disabledClasses}`.trim();
  }, [disabled]);

  return (
    <div role="search" className={`relative w-full sm:w-80 ${className}`}>
      <input
        type="search"
        placeholder={placeholder}
        className={inputClassName}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        disabled={disabled}
        aria-label={placeholder}
        aria-disabled={disabled}
      />
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transition-colors ${disabled ? "text-slate-300" : "text-slate-400"}`}
        aria-hidden="true"
      />
    </div>
  );
}
