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
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
      <div className="grid items-center gap-8 rounded-box border border-base-300 bg-base-200/70 p-5 shadow-xl sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10 lg:p-10">
        <div>
          <h2 className="text-3xl font-black text-base-content sm:text-4xl">Integration-ready structure</h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-base-content/65">
            Partner logos now sit on the same dark card surface as the rest of the app.
          </p>
        </div>
        <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-between lg:gap-x-10 lg:gap-y-8">
          {PARTNERS.map((partner) => (
            <div key={partner.name} className="flex h-14 min-w-0 items-center justify-center rounded-field bg-base-100/60 px-5 lg:justify-start">
              <img src={partner.logo} alt={partner.name} className="max-h-10 w-auto object-contain opacity-60 invert grayscale transition-all hover:opacity-100 hover:grayscale-0" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
