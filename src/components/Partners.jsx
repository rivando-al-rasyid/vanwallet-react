const PARTNERS = [
  {
    name: "Microsoft",
    logo: "https://api.iconify.design/simple-icons:microsoft.svg",
  },
  {
    name: "Dropbox",
    logo: "https://api.iconify.design/simple-icons:dropbox.svg",
  },
  {
    name: "H&M",
    logo: "https://api.iconify.design/simple-icons:handm.svg",
  },
  {
    name: "Airbnb",
    logo: "https://api.iconify.design/simple-icons:airbnb.svg",
  },
  {
    name: "Canon",
    logo: "/img/canon.svg",
  },
  {
    name: "Dell",
    logo: "https://api.iconify.design/simple-icons:dell.svg",
  },
];

export default function Partners() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-4xl font-semibold text-gray-900">
            100+ Trusted Partners
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-gray-500">
            We have reached global level and have 100+ brand partners around the
            globe.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-x-12 gap-y-8 lg:justify-between">
          {PARTNERS.map(({ name, logo }) => (
            <div key={name} className="flex h-14 items-center">
              <img
                src={logo}
                alt={name}
                className="h-10 w-auto object-contain opacity-70 grayscale"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
