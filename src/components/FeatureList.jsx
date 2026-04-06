import { CheckCircle2 } from "lucide-react";

const FEATURES = ["Small Fee", "Data Secured", "User Friendly"];

export default function FeatureList() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div className="flex justify-center">
          <img
            src="/img/imagez.png"
            alt="Payment illustration"
            className="w-full max-w-sm"
          />
        </div>

        <div>
          <h2 className="max-w-lg text-4xl font-semibold leading-tight text-gray-900">
            All The Great Zwallet Features.
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-gray-500">
            We have some great features from the application and it is totally
            free to use by all users around the world.
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map((text) => (
              <li key={text} className="flex items-center gap-3">
                <CheckCircle2
                  size={22}
                  className="text-green-500 shrink-0"
                  aria-hidden="true"
                />
                <span className="font-semibold text-gray-800">{text}</span>
              </li>
            ))}
          </ul>

          <button className="mt-8 rounded-lg bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
