import { Smartphone, ArrowRight } from "lucide-react";
import phoneBigImage from "../../assets/img/phonebig.png";
import phoneSmallImage from "../../assets/img/phonesmall.png";

export default function DownloadCTA() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-box border border-base-300 bg-base-200 px-5 py-10 shadow-2xl sm:px-10 sm:py-12 lg:grid-cols-2 lg:px-14">
        <div className="relative flex justify-center lg:justify-start">
          <div className="absolute inset-10 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative w-fit">
            <img src={phoneBigImage} alt="Main app screen" loading="lazy" className="relative z-10 w-40 drop-shadow-2xl sm:w-52 lg:w-64" />
            <img src={phoneSmallImage} alt="Secondary app screen" loading="lazy" className="absolute -right-3 bottom-0 z-20 w-28 drop-shadow-2xl sm:-right-6 sm:w-40 lg:-right-8 lg:w-48" />
          </div>
        </div>
        <div className="text-center lg:text-left">
          <p className="text-xs font-black tracking-[0.25em] text-secondary uppercase">Mobile ready</p>
          <h2 className="mt-4 text-3xl leading-tight font-black text-base-content sm:text-4xl lg:text-5xl">Start from the dashboard, extend to mobile later.</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-base-content/70 lg:mx-0">
            This keeps the current React web app usable while giving the product a stronger wallet identity.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start">
            <a href="/dashboard" className="btn btn-primary rounded-field px-7 font-black"><Smartphone size={18} /> Open App</a>
            <a href="/register" className="btn btn-outline rounded-field px-7 font-bold">Create Account <ArrowRight size={18} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
