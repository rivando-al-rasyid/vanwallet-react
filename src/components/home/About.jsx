import { memo } from "react";
import aboutPhoneImage from "../../assets/img/phoneback.png";

const About = memo(function About() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-24">
      <div className="z-10 flex flex-col justify-center lg:pr-10">
        <p className="text-primary text-xs font-black tracking-[0.25em] uppercase">
          Welcome to E-Wallet
        </p>
        <h2 className="text-base-content mt-4 max-w-xl text-3xl leading-tight font-black sm:text-4xl lg:text-5xl">
          Your all-in-one digital payment solution.
        </h2>
        <p className="text-base-content/65 mt-6 max-w-lg text-base leading-8">
          Say goodbye to scattered payment flows. E-Wallet brings secure
          transfers, top ups, and history tracking into one simple product
          experience.
        </p>
        <button className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 mt-8 w-fit rounded-2xl bg-gradient-to-r px-8 py-3 text-base font-black text-white shadow-lg transition hover:-translate-y-0.5">
          Get Started
        </button>
      </div>
      <div className="relative flex items-center justify-center lg:justify-end">
        <div className="absolute inset-8 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="border-base-300 bg-base-100 relative h-72 w-full overflow-hidden rounded-[2rem] border shadow-2xl sm:h-96 sm:rounded-[2.5rem] lg:h-[31.25rem]">
          <img
            src={aboutPhoneImage}
            alt="E-Wallet app interface preview"
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
});

export default About;
