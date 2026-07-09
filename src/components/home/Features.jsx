import { Headphones, ShieldCheck, Zap } from "lucide-react";

const FEATURES = [
  {
    Icon: Zap,
    title: "Fast Daily Actions",
    desc: "Top up, transfer, and inspect wallet movement with fewer visual distractions.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure Flow",
    desc: "The dark interface puts stronger focus on account state, alerts, and confirmations.",
  },
  {
    Icon: Headphones,
    title: "Support Ready",
    desc: "Cards, states, and feedback messages now use the same basedtoast tone system.",
  },
];

export default function Features() {
  return (
    <section className="relative z-10 bg-base-100">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div key={title} className="card rounded-box border border-base-300 bg-base-200/70 shadow-xl transition hover:-translate-y-1 hover:border-primary/40">
            <div className="card-body">
              <div className="flex h-12 w-12 items-center justify-center rounded-field bg-primary/15">
                <Icon size={22} className="text-primary" />
              </div>
              <h3 className="card-title mt-3 text-base-content">{title}</h3>
              <p className="text-sm leading-6 text-base-content/65">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
