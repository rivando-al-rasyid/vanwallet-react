export default function SearchInput({
  value,
  onChange,
  placeholder = "Enter Number Or Full Name",
}) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-80 pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
        value={value}
        onChange={onChange}
      />
      <svg
        className="absolute right-3 top-2.5 text-gray-400"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
