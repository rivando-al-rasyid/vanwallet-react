import { CheckCircle2 } from "lucide-react";
import featureImage from "../../assets/img/imagez.png";

const FEATURES = ["Small Fee", "Data Secured", "User Friendly"];

export default function FeatureList() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-24">
        <div className="bg-base-100 flex justify-center rounded-[2rem] p-5 shadow-sm sm:p-8">
          <img
            src={featureImage}
            alt="Payment illustration"
            className="w-full max-w-sm"
          />
        </div>
        <div>
          <h2 className="text-base-content max-w-lg text-3xl leading-tight font-black sm:text-4xl lg:text-5xl">
            All the important wallet features in one place.
          </h2>
          <p className="text-base-content/65 mt-5 max-w-md text-base leading-8">
            The UI now focuses on clear hierarchy, stronger contrast, and easier
            scanning for daily financial actions.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2
                  size={22}
                  className="text-success shrink-0"
                  aria-hidden="true"
                />
                <span className="text-base-content font-bold">{feature}</span>
              </li>
            ))}
          </ul>
          <button className="bg-neutral text-neutral-content hover:bg-primary/90 mt-8 rounded-2xl px-7 py-3 font-black transition hover:-translate-y-0.5">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
