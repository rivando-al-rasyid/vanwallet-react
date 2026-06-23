import { Download, Headphones, ShieldCheck } from "lucide-react";

const FEATURES = [
  { Icon: Headphones, title: "24 / 7 Support", desc: "Reach support whenever you need help with transfers or account access." },
  { Icon: ShieldCheck, title: "Data Privacy", desc: "Sensitive wallet data is protected with a cleaner and more secure flow." },
  { Icon: Download, title: "Easy Access", desc: "Use the wallet experience from mobile or desktop without friction." },
];

export default function Features() {
  return (
    <section className="relative z-10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-10">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div key={title} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50"><Icon size={22} className="text-indigo-600" /></div>
            <h3 className="mt-5 mb-2 text-lg font-black text-slate-950">{title}</h3>
            <p className="text-sm leading-6 text-slate-500">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
