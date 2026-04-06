import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const STORE_BUTTONS = [
  {
    label: "Play Store",
    icon: faGooglePlay,
    className:
      "bg-blue-600 text-white hover:bg-blue-700",
  },
  {
    label: "App Store",
    icon: faApple,
    className:
      "border border-blue-600 text-blue-600 hover:bg-blue-50",
  },
];

export default function DownloadCTA() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-10">
      {/* Phone mockup */}
      <div className="relative flex justify-center lg:justify-start">
        <div className="relative w-fit">
          <img
            src="/img/phonebig.png"
            alt="Main app screen"
            loading="lazy"
            className="relative z-10 w-52 drop-shadow-2xl sm:w-60 lg:w-72"
          />
          <img
            src="/img/phonesmall.png"
            alt="Secondary app screen"
            loading="lazy"
            className="absolute bottom-0 -right-10 z-20 w-36 drop-shadow-2xl sm:w-44 lg:w-52"
          />
        </div>
      </div>

      {/* CTA content */}
      <div>
        <h2 className="text-4xl font-semibold leading-tight text-gray-900">
          Download The App
        </h2>
        <p className="mt-5 max-w-lg text-base leading-7 text-gray-500">
          Ready to experience the future of payments? Download e-wallet now and
          enjoy a world of convenience at your fingertips.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          {STORE_BUTTONS.map(({ label, icon, className }) => (
            <button
              key={label}
              className={`flex min-w-45 items-center justify-center gap-3 rounded-lg px-6 py-3 font-medium transition ${className}`}
            >
              <FontAwesomeIcon icon={icon} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
