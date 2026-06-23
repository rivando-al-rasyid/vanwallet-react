import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import phoneBigImage from "../../assets/img/phonebig.png";
import phoneSmallImage from "../../assets/img/phonesmall.png";

const AVATAR_IDS = [21, 22, 23, 24];
const USER_COUNT = "4.6 M";
const ICON_SIZE = 18;

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(79,70,229,0.55),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(16,185,129,0.35),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200 backdrop-blur">Digital wallet</span>
          <h1 className="mt-6 text-4xl leading-tight font-black tracking-tight sm:text-5xl lg:text-7xl">
            Experience the future of digital payments.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Transfer, top up, and track your money from one polished dashboard built for daily payments.
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
    <div className="relative flex justify-center lg:justify-end">
      <div className="absolute inset-10 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="relative w-fit rounded-[3rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <img src={phoneBigImage} alt="Main app screen" className="relative z-10 w-44 drop-shadow-2xl sm:w-56 lg:w-72" />
        <img src={phoneSmallImage} alt="Secondary app screen" className="absolute -right-4 bottom-6 z-20 w-32 drop-shadow-2xl sm:w-40 lg:-right-8 lg:w-52" />
      </div>
    </div>
  );
}

function DownloadButtons() {
  return (
    <div className="mt-8 mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mb-10">
      <button className="flex w-full min-w-42 items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50 sm:w-auto">
        <FontAwesomeIcon icon={faGooglePlay} height={ICON_SIZE} width={ICON_SIZE} /><span>Play Store</span>
      </button>
      <button className="flex w-full min-w-42 items-center justify-center gap-3 rounded-2xl border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/10 sm:w-auto">
        <FontAwesomeIcon icon={faApple} height={ICON_SIZE} width={ICON_SIZE} /><span>App Store</span>
      </button>
    </div>
  );
}

function UserStats() {
  return (
    <div className="flex items-center gap-5">
      <div className="text-4xl leading-none font-black sm:text-5xl">{USER_COUNT}</div>
      <div>
        <div className="mb-2 flex -space-x-3">
          {AVATAR_IDS.map((id) => (
            <img key={id} src={`https://i.pravatar.cc/100?img=${id}`} alt="User avatar" className="h-10 w-10 rounded-full border-2 border-slate-950 object-cover" />
          ))}
        </div>
        <p className="max-w-xs text-sm leading-6 text-slate-300">Happy users already trust the wallet for everyday payments.</p>
      </div>
    </div>
  );
}
