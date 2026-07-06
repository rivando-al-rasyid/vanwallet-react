import { Download, Headphones, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    Icon: Headphones,
    title: "24 / 7 Support",
    desc: "Reach support whenever you need help with transfers or account access.",
  },
  {
    Icon: ShieldCheck,
    title: "Data Privacy",
    desc: "Sensitive wallet data is protected with a cleaner and more secure flow.",
  },
  {
    Icon: Download,
    title: "Easy Access",
    desc: "Use the wallet experience from mobile or desktop without friction.",
  },
];

export default function Features() {
  return (
    <section className="bg-base-100 relative z-10">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="border-base-300 bg-base-100 rounded-[2rem] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
              <Icon size={22} className="text-primary" />
            </div>
            <h3 className="text-base-content mt-5 mb-2 text-lg font-black">
              {title}
            </h3>
            <p className="text-base-content/65 text-sm leading-6">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
