import { CheckCircle2 } from "lucide-react";
import featureImage from "../../assets/img/imagez.png";

const FEATURES = ["Small Fee", "Data Secured", "User Friendly"];

export default function FeatureList() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        <div className="flex justify-center rounded-[2rem] bg-base-100 p-8 shadow-sm">
          <img src={featureImage} alt="Payment illustration" className="w-full max-w-sm" />
        </div>
        <div>
          <h2 className="max-w-lg text-3xl leading-tight font-black text-base-content sm:text-5xl">All the important wallet features in one place.</h2>
          <p className="mt-5 max-w-md text-base leading-8 text-base-content/65">The UI now focuses on clear hierarchy, stronger contrast, and easier scanning for daily financial actions.</p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3"><CheckCircle2 size={22} className="shrink-0 text-success" aria-hidden="true" /><span className="font-bold text-base-content">{feature}</span></li>
            ))}
          </ul>
          <button className="mt-8 rounded-2xl bg-neutral px-7 py-3 font-black text-neutral-content transition hover:-translate-y-0.5 hover:bg-primary/90">Get Started</button>
        </div>
      </div>
    </section>
  );
}
