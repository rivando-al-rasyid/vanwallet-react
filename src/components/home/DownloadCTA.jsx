import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import phoneBigImage from "../../assets/img/phonebig.png";
import phoneSmallImage from "../../assets/img/phonesmall.png";

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
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-10">
      {/* Phone mockup */}
      <div className="relative flex justify-center lg:justify-start">
        <div className="relative w-fit">
          <img
            src={phoneBigImage}
            alt="Main app screen"
            loading="lazy"
            className="relative z-10 w-40 drop-shadow-2xl sm:w-48 md:w-52 lg:w-72"
          />
          <img
            src={phoneSmallImage}
            alt="Secondary app screen"
            loading="lazy"
            className="absolute bottom-0 -right-6 z-20 w-28 drop-shadow-2xl sm:w-36 md:w-40 lg:w-52 lg:-right-10"
          />
        </div>
      </div>

      {/* CTA content */}
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
          Download The App
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:mt-5 sm:text-base sm:leading-7 lg:mx-0">
          Ready to experience the future of payments? Download e-wallet now and
          enjoy a world of convenience at your fingertips.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-center lg:mt-8 lg:justify-start">
          {STORE_BUTTONS.map(({ label, icon, className }) => (
            <button
              key={label}
              className={`flex w-full min-w-45 items-center justify-center gap-3 rounded-lg px-6 py-3 font-medium transition sm:w-auto ${className}`}
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
