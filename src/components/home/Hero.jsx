import { WalletCards, Send, ShieldCheck, ArrowRight } from "lucide-react";
import phoneBigImage from "../../assets/img/phonebig.png";
import phoneSmallImage from "../../assets/img/phonesmall.png";

const METRICS = [
  { label: "Daily limit", value: "24/7" },
  { label: "Fee from", value: "0.5%" },
  { label: "Tracked", value: "Real-time" },
];

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-base-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,color-mix(in_oklch,var(--color-primary)_28%,transparent),transparent_28%),radial-gradient(circle_at_80%_8%,color-mix(in_oklch,var(--color-accent)_18%,transparent),transparent_24%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-10 lg:py-24">
        <div className="max-w-3xl min-w-0">
          <span className="badge badge-primary badge-outline rounded-selector px-4 py-3 text-xs font-black tracking-[0.25em] uppercase">
            Basedtoast Wallet UI
          </span>
          <h1 className="mt-6 text-4xl leading-tight font-black tracking-tight text-base-content sm:text-5xl lg:text-6xl xl:text-7xl">
            A sharper dark wallet dashboard for everyday payments.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-base-content/70 sm:text-lg">
            Transfer, top up, and monitor every rupiah through a focused dark interface built around your custom DaisyUI theme.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="/register" className="btn btn-primary rounded-field px-7 font-black">
              Create Wallet <ArrowRight size={18} />
            </a>
            <a href="/login" className="btn btn-outline rounded-field px-7 font-bold">
              Open Dashboard
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {METRICS.map((metric) => (
              <div key={metric.label} className="rounded-box border border-base-300 bg-base-200/70 p-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-widest text-base-content/45">{metric.label}</p>
                <p className="mt-2 text-xl font-black text-base-content">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
        <PhoneMockup />
      </div>
    </header>
  );
}

function PhoneMockup() {
  return (
    <div className="relative flex min-w-0 justify-center lg:justify-end">
      <div className="absolute inset-8 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative w-full max-w-md rounded-box border border-base-300 bg-base-200/80 p-5 shadow-2xl backdrop-blur sm:p-8">
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-box bg-base-100 p-4">
            <WalletCards className="text-primary" size={24} />
            <p className="mt-4 text-xs text-base-content/50">Balance</p>
            <p className="text-2xl font-black">Rp12.8M</p>
          </div>
          <div className="rounded-box bg-base-100 p-4">
            <Send className="text-secondary" size={24} />
            <p className="mt-4 text-xs text-base-content/50">Transfer</p>
            <p className="text-2xl font-black">Fast</p>
          </div>
        </div>
        <div className="relative flex justify-center overflow-hidden rounded-box bg-base-100 p-6">
          <ShieldCheck className="absolute left-5 top-5 text-success" size={24} />
          <img src={phoneBigImage} alt="Main app screen" className="relative z-10 w-40 drop-shadow-2xl sm:w-56 lg:w-64" />
          <img src={phoneSmallImage} alt="Secondary app screen" className="absolute bottom-6 right-5 z-20 w-28 drop-shadow-2xl sm:w-40 lg:w-44" />
        </div>
      </div>
    </div>
  );
}
