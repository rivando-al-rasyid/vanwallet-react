import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import phoneBigImage from "../../assets/img/phonebig.png";
import phoneSmallImage from "../../assets/img/phonesmall.png";

const STORE_BUTTONS = [
  { label: "Play Store", icon: faGooglePlay, className: "bg-base-100 text-primary hover:bg-success/10" },
  { label: "App Store", icon: faApple, className: "border border-neutral-content/20 text-neutral-content hover:bg-neutral-content/10" },
];

export default function DownloadCTA() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-[2.5rem] bg-neutral px-6 py-12 text-neutral-content sm:px-10 lg:grid-cols-2 lg:px-14">
        <div className="relative flex justify-center lg:justify-start">
          <div className="absolute inset-10 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative w-fit">
            <img src={phoneBigImage} alt="Main app screen" loading="lazy" className="relative z-10 w-40 drop-shadow-2xl sm:w-52 lg:w-64" />
            <img src={phoneSmallImage} alt="Secondary app screen" loading="lazy" className="absolute -right-6 bottom-0 z-20 w-28 drop-shadow-2xl sm:w-40 lg:-right-10 lg:w-48" />
          </div>
        </div>
        <div className="text-center lg:text-left">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-success">Mobile ready</p>
          <h2 className="mt-4 text-3xl leading-tight font-black sm:text-5xl">Download The App</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-neutral-content/70 lg:mx-0">Ready to experience the future of payments? Download e-wallet now and enjoy a world of convenience at your fingertips.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start">
            {STORE_BUTTONS.map(({ label, icon, className }) => (
              <button key={label} className={`flex w-full min-w-44 items-center justify-center gap-3 rounded-2xl px-6 py-3 font-bold transition hover:-translate-y-0.5 sm:w-auto ${className}`}>
                <FontAwesomeIcon icon={icon} aria-hidden="true" /><span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
