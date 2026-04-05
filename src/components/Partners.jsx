// Partners.jsx
const partners = ["Microsoft", "Dropbox", "H&M", "airbnb", "Canon", "Dell"];

export default function Partners() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-4xl font-semibold text-gray-900">
            100+ Trusted Partners
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-gray-500">
            We have reached global level and have 100+ brand partners around
            the globe.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-x-12 gap-y-6 text-3xl font-semibold text-gray-500">
          {partners.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
