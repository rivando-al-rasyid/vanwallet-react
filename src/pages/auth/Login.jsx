import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
export default function Login() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#F0F5FD] font-sans">
      {/* LEFT FORM SECTION */}
      <section className="flex flex-col justify-center items-center px-10 py-16 lg:px-20 lg:py-16 bg-white xl:rounded-r-[60px] shadow-sm">
        <div className="w-full max-w-[560px]">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-10">
            <img
              src="../../../src/assets/img/logo.png"
              alt="E-Wallet Logo"
              className="w-8 h-8"
            />
            <h1 className="text-3xl font-bold text-[#6379F4]">E-Wallet</h1>
          </div>

          {/* Headline and Description */}
          <div className="mb-14">
            <h2 className="text-4xl font-extrabold text-[#3A3D42] leading-[54px] mb-6">
              Start Accessing Banking Needs
              <br />
              With All Devices and All Platforms
              <br />
              With 30.000+ Users
            </h2>
            <p className="text-lg text-[rgba(58,61,66,0.6)] leading-8 max-w-[480px]">
              Transfering money is easier than ever, you can access Zwallet
              wherever you are. Desktop, laptop, mobile phone? we cover all of
              that for you!
            </p>
          </div>

          {/* Social Sign In Buttons */}
          <div className="flex flex-col gap-4 mb-8">
            <button className="flex w-full items-center justify-center gap-3 py-4.5 px-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
              <FontAwesomeIcon icon={faGoogle} className="w-6 h-6" />
              <span className="text-lg text-[#3A3D42]">
                Sign In With Google
              </span>
            </button>
            <button className="flex w-full items-center justify-center gap-3 py-4.5 px-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
              <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
              <span className="text-lg text-[#3A3D42]">
                Sign In With Facebook
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-base text-[rgba(58,61,66,0.6)]">
              Or
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Registration Form */}
          <form className="space-y-10">
            {/* Email Field */}
            <div className="relative">
              <label
                htmlFor="email"
                className="text-lg font-semibold text-[#3A3D42] mb-3 block"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter Your Email"
                  className="w-full text-lg text-[#3A3D42] placeholder:text-[rgba(58,61,66,0.6)] px-14 py-4.5 border border-slate-200 rounded-xl focus:border-[#6379F4] focus:ring-1 focus:ring-[#6379F4] outline-none transition"
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3A3D42] w-6 h-6"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="text-lg font-semibold text-[#3A3D42] mb-3 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter Your Password"
                  className="w-full text-lg text-[#3A3D42] placeholder:text-[rgba(58,61,66,0.6)] px-14 py-4.5 border border-slate-200 rounded-xl focus:border-[#6379F4] focus:ring-1 focus:ring-[#6379F4] outline-none transition"
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3A3D42] w-6 h-6"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="text-lg font-semibold text-[#3A3D42] mb-3 block"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Enter Your Password Again"
                  className="w-full text-lg text-[#3A3D42] placeholder:text-[rgba(58,61,66,0.6)] px-14 py-4.5 border border-slate-200 rounded-xl focus:border-[#6379F4] focus:ring-1 focus:ring-[#6379F4] outline-none transition"
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3A3D42] w-6 h-6"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4.5 px-6 text-lg font-semibold rounded-xl text-white bg-[#6379F4] hover:bg-[#5263cf] transition shadow-lg shadow-[#6379f433]"
              >
                Register
              </button>
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-lg text-[rgba(58,61,66,0.6)] mt-8">
            Have An Account?{" "}
            <a
              href="/login"
              className="font-semibold text-[#6379F4] hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </section>

      {/* RIGHT 3D IMAGE SECTION */}
      <aside className="hidden lg:flex flex-col justify-center items-center bg-[#F0F5FD] px-10 h-full">
        <div className="relative w-full max-w-[640px] aspect-[1/1] flex justify-center items-center">
          {/* Main 3D Hand Wallet Image */}
          <img
            src="../../../src/assets/img/3d-hand-wallet.png"
            alt="3D Illustration of hand holding a wallet"
            className="relative z-10 w-full h-auto object-contain max-w-[560px]"
          />
        </div>
      </aside>
    </main>
  );
}
