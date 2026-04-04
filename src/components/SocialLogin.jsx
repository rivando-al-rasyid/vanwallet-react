import React from "react";

export default function SocialLogin() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {/* Google Button */}
        <button className="flex items-center justify-center gap-3 py-3 px-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-slate-600 font-medium">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Sign In With Google</span>
        </button>

        {/* Facebook Button */}
        <button className="flex items-center justify-center gap-3 py-3 px-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-slate-600 font-medium">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-[#1877F2]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Sign In With Facebook</span>
        </button>
      </div>
      {/* Divider */}
      <div className="relative flex items-center mb-8">
        <div className="grow border-t border-slate-100"></div>
        <span className="shrink mx-4 text-sm font-medium text-slate-300">
          Or
        </span>
        <div className="grow border-t border-slate-100"></div>
      </div>
    </>
  );
}
