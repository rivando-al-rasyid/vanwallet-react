import { memo } from "react";
import aboutPhoneImage from "../../assets/img/phoneback.png";

const About = memo(function About() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-24">
      <div className="z-10 flex flex-col justify-center lg:pr-10">
        <p className="text-xs font-black tracking-[0.25em] text-indigo-600 uppercase">Welcome to E-Wallet</p>
        <h2 className="mt-4 max-w-xl text-3xl leading-tight font-black text-slate-950 sm:text-4xl lg:text-5xl">Your all-in-one digital payment solution.</h2>
        <p className="mt-6 max-w-lg text-base leading-8 text-slate-500">
          Say goodbye to scattered payment flows. E-Wallet brings secure transfers, top ups, and history tracking into one simple product experience.
        </p>
        <button className="mt-8 w-fit rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-base font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700">Get Started</button>
      </div>
      <div className="relative flex items-center justify-center lg:justify-end">
        <div className="absolute inset-8 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative h-80 w-full overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-2xl sm:h-96 lg:h-[31.25rem]">
          <img src={aboutPhoneImage} alt="E-Wallet app interface preview" loading="lazy" className="h-full w-full object-cover object-center" />
        </div>
      </div>
    </section>
  );
});

export default About;
