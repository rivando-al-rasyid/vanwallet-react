import { memo } from "react";
import aboutPhoneImage from "../../assets/img/phoneback.png";

const About = memo(function About() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-10 lg:py-24">
      <div className="z-10 flex flex-col justify-center lg:pr-10">
        <p className="text-xs font-black tracking-[0.25em] text-primary uppercase">Wallet Experience</p>
        <h2 className="mt-4 max-w-xl text-3xl leading-tight font-black text-base-content sm:text-4xl lg:text-5xl">
          Dark, compact, and easier to scan when money movement matters.
        </h2>
        <p className="mt-6 max-w-lg text-base leading-8 text-base-content/65">
          The redesign moves VanWallet toward a product UI: clear action hierarchy, neutral surfaces, sharp account cards, and status colors that come directly from the theme.
        </p>
        <a href="/register" className="btn btn-primary mt-8 w-fit rounded-field px-8 font-black">Get Started</a>
      </div>
      <div className="relative flex items-center justify-center lg:justify-end">
        <div className="absolute inset-8 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative h-72 w-full overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-2xl sm:h-96 lg:h-[31.25rem]">
          <img src={aboutPhoneImage} alt="VanWallet app interface preview" loading="lazy" className="h-full w-full object-cover object-center opacity-90" />
        </div>
      </div>
    </section>
  );
});

export default About;
