import { useState } from "react";
import { Icon } from "@iconify/react";

/**
 * A labeled password input with a show/hide toggle button.
 *
 * @param {object}   props
 * @param {string}   props.label       - Field label text
 * @param {string}   props.name        - Input name attribute
 * @param {string}   props.value       - Controlled value
 * @param {Function} props.onChange    - Change handler
 * @param {string}   props.placeholder - Placeholder text
 */
export default function PasswordField({ label, name, value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon icon="lucide:lock" width={16} height={16} aria-hidden="true" />
        </span>
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <Icon
            icon={visible ? "lucide:eye-off" : "lucide:eye"}
            width={18}
            height={18}
          />
        </button>
      </div>
    </div>
  );
}
