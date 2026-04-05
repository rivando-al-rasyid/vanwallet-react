// DownloadCTA.jsx
import Phonesmall from "../assets/img/phonesmall.png";
import Phonebig from "../assets/img/phonebig.png";
import { Play, Apple } from "lucide-react";

export default function DownloadCTA() {
  return (
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
  );
}
