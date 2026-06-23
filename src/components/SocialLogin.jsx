const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#1877F2]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const SOCIAL_BUTTONS = [
  {
    label: "Sign In With Google",
    icon: <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-5 w-5" />,
  },
  { label: "Sign In With Facebook", icon: <FacebookIcon /> },
];

export default function SocialLogin() {
  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {SOCIAL_BUTTONS.map(({ label, icon }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-5 py-3 text-sm font-bold text-base-content/80 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="relative mb-8 flex items-center" aria-hidden="true">
        <div className="grow border-t border-base-300" />
        <span className="mx-4 shrink rounded-full bg-base-100 px-3 text-xs font-bold text-base-content/50">Or</span>
        <div className="grow border-t border-base-300" />
      </div>
    </>
  );
}
