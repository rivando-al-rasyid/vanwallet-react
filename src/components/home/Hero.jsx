import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import phoneBigImage from "../../assets/img/phonebig.png";
import phoneSmallImage from "../../assets/img/phonesmall.png";

const AVATAR_IDS = [21, 22, 23, 24];
const USER_COUNT = "4.6 M";
const ICON_SIZE = 18;

export default function Hero() {
  return (
    <header className="bg-neutral text-neutral-content relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(79,70,229,0.55),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(16,185,129,0.35),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-10 lg:py-24">
        <div className="max-w-3xl min-w-0">
          <span className="border-neutral-content/20 bg-neutral-content/10 text-success inline-flex rounded-full border px-4 py-2 text-xs font-black tracking-[0.25em] uppercase backdrop-blur">
            Digital wallet
          </span>
          <h1 className="mt-6 text-4xl leading-tight font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Experience the future of digital payments.
          </h1>
          <p className="text-neutral-content/70 mt-6 max-w-xl text-base leading-8 sm:text-lg">
            Transfer, top up, and track your money from one polished dashboard
            built for daily payments.
          </p>
          <DownloadButtons />
          <UserStats />
        </div>
        <PhoneMockup />
      </div>
    </header>
  );
}

function PhoneMockup() {
  return (
    <div className="relative flex min-w-0 justify-center lg:justify-end">
      <div className="bg-primary/20 absolute inset-10 rounded-full blur-3xl" />
      <div className="border-neutral-content/20 bg-neutral-content/10 relative w-fit max-w-full rounded-[2rem] border p-5 shadow-2xl backdrop-blur sm:rounded-[3rem] sm:p-8">
        <img
          src={phoneBigImage}
          alt="Main app screen"
          className="relative z-10 w-40 drop-shadow-2xl sm:w-56 lg:w-64 xl:w-72"
        />
        <img
          src={phoneSmallImage}
          alt="Secondary app screen"
          className="absolute -right-2 bottom-6 z-20 w-28 drop-shadow-2xl sm:-right-4 sm:w-40 lg:-right-6 lg:w-48 xl:-right-8 xl:w-52"
        />
      </div>
    </div>
  );
}

function DownloadButtons() {
  return (
    <div className="mt-8 mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mb-10">
      <button className="bg-base-100 text-primary hover:bg-success/10 flex w-full min-w-42 items-center justify-center gap-3 rounded-2xl px-6 py-3 font-bold shadow-lg transition hover:-translate-y-0.5 sm:w-auto">
        <FontAwesomeIcon
          icon={faGooglePlay}
          height={ICON_SIZE}
          width={ICON_SIZE}
        />
        <span>Play Store</span>
      </button>
      <button className="border-neutral-content/20 text-neutral-content hover:bg-neutral-content/10 flex w-full min-w-42 items-center justify-center gap-3 rounded-2xl border px-6 py-3 font-bold transition sm:w-auto">
        <FontAwesomeIcon icon={faApple} height={ICON_SIZE} width={ICON_SIZE} />
        <span>App Store</span>
      </button>
    </div>
  );
}

function UserStats() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="text-4xl leading-none font-black sm:text-5xl">
        {USER_COUNT}
      </div>
      <div>
        <div className="mb-2 flex -space-x-3">
          {AVATAR_IDS.map((id) => (
            <img
              key={id}
              src={`https://i.pravatar.cc/100?img=${id}`}
              alt="User avatar"
              className="border-neutral h-10 w-10 rounded-full border-2 object-cover"
            />
          ))}
        </div>
        <p className="text-neutral-content/70 max-w-xs text-sm leading-6">
          Happy users already trust the wallet for everyday payments.
        </p>
      </div>
    </div>
  );
}
