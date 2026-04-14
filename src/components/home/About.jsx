import { memo } from "react";
import aboutPhoneImage from "../../assets/img/phoneback.png";

const About = memo(function About() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-24">
      {/* Left Content */}
      <div className="z-10 flex flex-col justify-center py-2 lg:pr-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600 sm:text-sm sm:tracking-[0.2em]">
          Welcome to E-Wallet
        </p>
        <h2 className="mt-3 max-w-md text-2xl font-bold leading-tight text-gray-900 sm:mt-4 sm:text-3xl lg:text-4xl">
          Your All-in-One Digital Payment Solution
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-500 sm:mt-6 sm:text-base">
          Say goodbye to cash and hello to the future of payments! With
          e-wallet, you have the power of secure, fast, and convenient digital
          transactions right at your fingertips. Whether you're shopping,
          dining out, or sending money to loved ones, we've got you covered.
        </p>
        <button className="mt-6 w-fit rounded-lg bg-blue-600 px-8 py-2.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 sm:mt-8 sm:px-10 sm:py-3 sm:text-lg">
          Get Started
        </button>
      </div>

      {/* Right Content */}
      <div className="relative flex items-center justify-center lg:justify-end">
        <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96 lg:h-125">
          <img
            src={aboutPhoneImage}
            alt="E-Wallet app interface preview"
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
});

export default About;
