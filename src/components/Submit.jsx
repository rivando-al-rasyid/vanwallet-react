/**
 * Description placeholder
 *
 * @export
 * @param {object} props
 * @param {string} props.name
 */
export default function Submit({ name }) {
  return (
    <button
      type="submit"
      className="w-full py-4 px-6 text-base font-bold rounded-2xl text-white bg-[#6379F4] hover:bg-[#4d61da] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-[#6379f430]"
    >
      {name}
    </button>
  );
}
