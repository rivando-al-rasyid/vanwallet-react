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
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-3 lg:px-10">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Icon size={22} className="text-blue-600" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm leading-6 text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
