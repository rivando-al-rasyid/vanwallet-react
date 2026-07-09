import { CheckCircle2 } from "lucide-react";
import featureImage from "../../assets/img/imagez.png";

const FEATURES = ["Lower visual noise", "Theme-based status colors", "Dashboard-first layout"];

export default function FeatureList() {
  return (
    <section className="bg-base-100">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-24">
        <div className="flex justify-center rounded-box border border-base-300 bg-base-200/80 p-5 shadow-xl sm:p-8">
          <img src={featureImage} alt="Payment illustration" className="w-full max-w-sm" />
        </div>
        <div>
          <h2 className="max-w-lg text-3xl leading-tight font-black text-base-content sm:text-4xl lg:text-5xl">
            One visual language across landing, auth, and dashboard.
          </h2>
          <p className="mt-5 max-w-md text-base leading-8 text-base-content/65">
            The VanWallet palette is a focused blue system that adapts to
            light or dark automatically, so cards, inputs, navigation, and
            charts stay consistent everywhere.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2 size={22} className="shrink-0 text-success" aria-hidden="true" />
                <span className="font-bold text-base-content">{feature}</span>
              </li>
            ))}
          </ul>
          <a href="/login" className="btn btn-secondary mt-8 rounded-field px-7 font-black">View Dashboard</a>
        </div>
      </div>
    </section>
  );
}
