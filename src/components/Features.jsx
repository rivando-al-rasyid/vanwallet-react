// Features.jsx
import { Headphones, ShieldCheck, Download } from "lucide-react";

const features = [
  {
    icon: <Headphones size={22} className="text-blue-600" />,
    title: "24 / 7 Support",
    desc: "We have 24/7 contact support, so you can contact us whenever you want and we will respond quickly.",
  },
  {
    icon: <ShieldCheck size={22} className="text-blue-600" />,
    title: "Data Privacy",
    desc: "We make sure your data is safe in our database and keep every submitted record protected.",
  },
  {
    icon: <Download size={22} className="text-blue-600" />,
    title: "Easy Download",
    desc: "Zwallet is free to use and available on major mobile platforms for fast installation.",
  },
];

export default function Features() {
  return (
    <section className="relative z-10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-3 lg:px-10">
        {features.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
              {item.icon}
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm leading-6 text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
