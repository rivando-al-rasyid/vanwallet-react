import canonLogo from "../../assets/img/canon.svg";

const PARTNERS = [
  { name: "Microsoft", logo: "https://api.iconify.design/simple-icons:microsoft.svg" },
  { name: "Dropbox", logo: "https://api.iconify.design/simple-icons:dropbox.svg" },
  { name: "H&M", logo: "https://api.iconify.design/simple-icons:handm.svg" },
  { name: "Airbnb", logo: "https://api.iconify.design/simple-icons:airbnb.svg" },
  { name: "Canon", logo: canonLogo },
  { name: "Dell", logo: "https://api.iconify.design/simple-icons:dell.svg" },
];

export default function Partners() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="grid items-center gap-10 rounded-[2rem] border border-base-300 bg-base-100 p-8 shadow-sm lg:grid-cols-[1fr_2fr] lg:p-10">
        <div>
          <h2 className="text-3xl font-black text-base-content sm:text-4xl">100+ Trusted Partners</h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-base-content/65">A cleaner partner section with better spacing and card hierarchy.</p>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-x-12 gap-y-8 lg:justify-between">
          {PARTNERS.map((partner) => (
            <div key={partner.name} className="flex h-14 items-center"><img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0" loading="lazy" /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
