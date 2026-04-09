import { Headphones, ShieldCheck, Download } from "lucide-react";

const FEATURES = [
  {
    Icon: Headphones,
    title: "24 / 7 Support",
    desc: "We have 24/7 contact support, so you can contact us whenever you want and we will respond quickly.",
  },
  {
    Icon: ShieldCheck,
    title: "Data Privacy",
    desc: "We make sure your data is safe in our database and keep every submitted record protected.",
  },
  {
    Icon: Download,
    title: "Easy Download",
    desc: "Zwallet is free to use and available on major mobile platforms for fast installation.",
  },
];

export default function Features() {
  return (
    <section className="relative z-10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-3 lg:px-10">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-12 sm:w-12">
              <Icon size={22} className="text-blue-600" />
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
                {title}
              </h3>
              <p className="text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
