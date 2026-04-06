import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

/**
 * A semantic search input component.
 * @param {Object} props
 * @param {string|number} props.value
 * @param {function(React.ChangeEvent<HTMLInputElement>): void} props.onChange
 * @param {string} [props.placeholder="Enter Number Or Full Name"]
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "Enter Number Or Full Name",
}) {
  return (
    <div role="search" className="relative w-80">
      <input
        type="search"
        placeholder={placeholder}
        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
        value={value}
        onChange={onChange}
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
