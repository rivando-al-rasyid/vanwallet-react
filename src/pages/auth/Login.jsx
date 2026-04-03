import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";

export default function Login() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#2948FF]">
      {/* LEFT FORM SECTION */}
      <section className="flex flex-col justify-center items-center px-6 py-12 lg:px-20 bg-white xl:rounded-r-[60px] shadow-2xl z-20">
        <div className="w-full max-w-125">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-10 group cursor-pointer">
            <div className="p-2 bg-[#6379F415] rounded-lg group-hover:bg-[#6379F4] transition-colors">
              <img
                src="../../../src/assets/img/logo.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#6379F4] tracking-tight">
              E-Wallet
            </h1>
          </div>

          {/* Headline and Description */}
          <div className="mb-10">
            <h2 className="text-[32px] font-extrabold text-[#3A3D42] leading-[1.2] mb-4">
              Hello Welcome Back 👋
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              Fill out the form correctly or you can login with several options.
            </p>
          </div>

          {/* Social Sign In Buttons - Matches UI closer with white bg */}
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

          {/* Registration Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3A3D42] ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6379F4] transition-colors">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter Your Email"
                  className="w-full bg-slate-50 border border-transparent focus:bg-white text-sm text-[#3A3D42] pl-12 pr-4 py-4 rounded-2xl focus:border-[#6379F4] outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#3A3D42] ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6379F4] transition-colors">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter Your Password"
                  className="w-full bg-slate-50 border border-transparent focus:bg-white text-sm text-[#3A3D42] pl-12 pr-12 py-4 rounded-2xl focus:border-[#6379F4] outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 text-base font-bold rounded-2xl text-white bg-[#6379F4] hover:bg-[#4d61da] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-[#6379f430]"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-8 font-medium">
            Have An Account?{" "}
            <a
              href="/login"
              className="text-[#6379F4] hover:underline font-bold"
            >
              Login
            </a>
          </p>
        </div>
      </section>
      {/* RIGHT 3D IMAGE SECTION */}
      <aside className="hidden lg:flex flex-col items-center justify-center h-full p-20 bg-[radial-gradient(circle,_#3868fd_0%,_transparent_100%)]bg-opacity-90">
        <img
          src="../../../src/assets/img/3d-hand-phone.png"
          alt="3D Illustration"
          className="relative z-10 w-4/5 h-auto object-contain drop-shadow-2xl"
        />
      </aside>
    </main>
  );
}
