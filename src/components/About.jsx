// About.jsx
export default function About() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
      {/* Left Content */}
      <div className="z-10 flex flex-col justify-center py-2 lg:pr-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Welcome to E-Wallet
          </p>
          <h2 className="mt-4 max-w-md text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
            Your All-in-One Digital Payment Solution
          </h2>
        </div>

        <div className="mt-6">
          <p className="max-w-lg text-base leading-relaxed text-gray-500">
            Say goodbye to cash and hello to the future of payments! With
            e-wallet, you have the power of secure, fast, and convenient digital
            transactions right at your fingertips. Whether you're shopping,
            dining out, or sending money to loved ones, we've got you covered.
          </p>

          <button className="mt-8 rounded-lg bg-blue-600 px-10 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95">
            Get Started
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="relative flex items-center justify-center lg:justify-end">
        <div className="relative h-100 w-full overflow-hidden lg:h-125">
          <img
            src="/img/phoneback.png"
            alt="E-Wallet Interface"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
