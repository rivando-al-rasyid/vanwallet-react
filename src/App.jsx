import Phonesmall from "./assets/img/phonesmall.png";
import Phonebig from "./assets/img/phonebig.png";
import Imagez from "./assets/img/imagez.png";
import Brand from "./components/Brand";
import PhoneBack from "./assets/img/phoneback.png";
import {
  ShieldCheck,
  Headphones,
  Download,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  Play,
  Apple,
} from "lucide-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faGithub,
  faApple,
  faGooglePlay,
} from "@fortawesome/free-brands-svg-icons";

function App() {
  const features = [
    {
      icon: <Headphones size={22} className="text-blue-600" />,
      title: "24 / 7 Support",
      desc: "We have 24/7 contact support, so you can contact us whenever you want and we will respond quickly.",
    },
    {
      icon: <ShieldCheck size={22} className="text-blue-600" />,
      title: "Data Privacy",
      desc: "We make sure your data is safe in our database and keep every submitted record protected.",
    },
    {
      icon: <Download size={22} className="text-blue-600" />,
      title: "Easy Download",
      desc: "Zwallet is free to use and available on major mobile platforms for fast installation.",
    },
  ];

  const partners = ["Microsoft", "Dropbox", "H&M", "airbnb", "Canon", "Dell"];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-blue-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Brand />
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-white/40 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10">
              Sign In
            </button>
            <button className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-gray-100">
              Sign Up
            </button>
          </div>
        </div>
      </nav>
      {/* HERO */}
      <header className="bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-6  pt-10 lg:px-10  lg:pt-14">
          <h1 className="mx-auto max-w-5xl text-center text-4xl font-semibold leading-tight tracking-tight lg:text-6xl">
            Experience the Future of Digital Payments with e-wallet
          </h1>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            {/* Left mockup */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative w-fit">
                <img
                  src={Phonebig}
                  alt="Main app screen"
                  className="relative z-10 w-52 drop-shadow-2xl sm:w-60 lg:w-72"
                />
                <img
                  src={Phonesmall}
                  alt="Secondary app screen"
                  className="absolute bottom-0 -right-10 z-20 w-36 drop-shadow-2xl sm:w-44 lg:w-52"
                />
              </div>
            </div>

            {/* Right content */}
            <div className="max-w-xl lg:ml-auto">
              <p className="mb-8 max-w-md text-base leading-7 text-white/80 lg:text-lg">
                Simplify Your Life with Secure and Convenient Mobile Payments
              </p>

              <div className="mb-10 flex flex-wrap gap-4">
                <button className="flex min-w-42.5 items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-lg transition hover:bg-gray-100">
                  <FontAwesomeIcon icon={faGooglePlay} height={18} width={18} />
                  <span>Play Store</span>
                </button>

                <button className="flex min-w-42.5 items-center justify-center gap-3 rounded-lg border border-white/50 px-6 py-3 font-medium text-white transition hover:bg-white/10">
                  <FontAwesomeIcon icon={faApple} height={18} width={18} />
                  <span>Apps Store</span>
                </button>
              </div>

              <div className="flex items-center gap-5">
                <div className="text-5xl font-semibold leading-none">4.6 M</div>

                <div>
                  <div className="mb-2 flex -space-x-3">
                    {[21, 22, 23, 24].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i}`}
                        alt="User avatar"
                        className="h-10 w-10 rounded-full border-2 border-blue-600 object-cover"
                      />
                    ))}
                  </div>
                  <p className="max-w-xs text-sm leading-6 text-white/80">
                    Around the world, we already have over 4.6 happy users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* TOP FEATURES */}
      <section className="relative z-10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-3 lg:px-10">
          {features.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                {item.icon}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ABOUT SECTION */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        {/* Left Content: Adjusted font sizes for a cleaner look */}
        <div className="z-10 flex flex-col justify-center py-2 lg:pr-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Welcome to E-Wallet
            </p>
            {/* Title size reduced from text-6xl/5xl to text-4xl/3xl */}
            <h2 className="mt-4 max-w-md text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
              Your All-in-One Digital Payment Solution
            </h2>
          </div>

          <div className="mt-6">
            <p className="max-w-lg text-base leading-relaxed text-gray-500">
              Say goodbye to cash and hello to the future of payments! With
              e-wallet, you have the power of secure, fast, and convenient
              digital transactions right at your fingertips. Whether you're
              shopping, dining out, or sending money to loved ones, we've got
              you covered.
            </p>

            <button className="mt-8 rounded-lg bg-blue-600 px-10 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Content: Fixed Image handling */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative h-100 w-full overflow-hidden  lg:h-125">
            <img
              src={PhoneBack}
              alt="E-Wallet Interface"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </section>
      {/* FEATURES LIST */}
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
          <div className="flex justify-center">
            <img
              src={Imagez}
              alt="Payment illustration"
              className="w-full max-w-sm"
            />
          </div>

          <div>
            <h2 className="max-w-lg text-4xl font-semibold leading-tight text-gray-900">
              All The Great Zwallet Features.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-gray-500">
              We have some great features from the application and it is totally
              free to use by all users around the world.
            </p>

            <ul className="mt-8 space-y-4">
              {["Small Fee", "Data Secured", "User Friendly"].map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={22} className="text-green-500" />
                  <span className="font-semibold text-gray-800">{text}</span>
                </li>
              ))}
            </ul>

            <button className="mt-8 rounded-lg bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </section>
      {/* PARTNERS */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-4xl font-semibold text-gray-900">
              100+ Trusted Partners
            </h2>
            <p className="mt-4 max-w-sm text-base leading-7 text-gray-500">
              We have reached global level and have 100+ brand partners around
              the globe.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-x-12 gap-y-6 text-3xl font-semibold text-gray-500">
            {partners.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIAL */}
      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-semibold text-gray-900">
            What Our Users Are Saying
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
            Ready to experience the future of payments? Download e-wallet now
            and enjoy a world of convenience at your fingertips.
          </p>

          <div className="relative mt-14">
            <button className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow md:flex">
              <ArrowLeft size={18} />
            </button>

            <div className="mx-auto max-w-2xl rounded-3xl bg-blue-600 px-8 py-10 text-white shadow-2xl lg:px-12">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="James Bond"
                className="mx-auto h-16 w-16 rounded-full border-4 border-white/20 object-cover"
              />
              <h3 className="mt-4 text-xl font-semibold">James Bond</h3>
              <div className="mt-3 flex justify-center gap-1 text-yellow-300">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s}>★</span>
                ))}
                <span className="ml-2 text-sm text-white/80">5.0</span>
              </div>
              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/90">
                I've been using the e-wallet for over two years now, and I'm
                very satisfied with the ease of use. This has completely changed
                the way I shop and conduct financial transactions.
              </p>
            </div>

            <button className="absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow md:flex">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
      {/* CTA DOWNLOAD */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          {/* Left mockup */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative w-fit">
              <img
                src={Phonebig}
                alt="Main app screen"
                className="relative z-10 w-52 drop-shadow-2xl sm:w-60 lg:w-72"
              />
              <img
                src={Phonesmall}
                alt="Secondary app screen"
                className="absolute bottom-0 -right-10 z-20 w-36 drop-shadow-2xl sm:w-44 lg:w-52"
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-semibold leading-tight text-gray-900">
            Download The App
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-gray-500">
            Ready to experience the future of payments? Download e-wallet now
            and enjoy a world of convenience at your fingertips.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex min-w-45 items-center justify-center gap-3 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
              <Play size={18} fill="currentColor" />
              <span>Play Store</span>
            </button>

            <button className="flex min-w-45 items-center justify-center gap-3 rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 transition hover:bg-blue-50">
              <Apple size={18} />
              <span>Apps Store</span>
            </button>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="bg-blue-600 px-6 pb-10 pt-16 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-4">
          <div>
            <Brand />
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/80">
              Clarity gives you the blocks and components you need to create a
              truly professional website.
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Get In Touch
            </h4>
            <div className="space-y-4 text-sm text-white/90">
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span>+62 5637 8882 9901</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span>contact@zwallet.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Social Media
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-base" />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-base" />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-base" />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="text-base" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Newsletter
            </h4>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full rounded-md border border-white/20 bg-white px-4 py-3 text-sm text-gray-800 outline-none"
              />
              <button className="w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-gray-100">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/20 pt-6 text-center text-sm text-white/70">
          © Copyright 2022. All Rights Reserved by ClarityUI
        </div>
      </footer>
    </div>
  );
}

export default App;
