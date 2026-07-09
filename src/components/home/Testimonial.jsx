import { ArrowLeft, ArrowRight } from "lucide-react";

const TESTIMONIAL = {
  name: "James Bond",
  avatarUrl: "https://i.pravatar.cc/100?img=12",
  rating: 5,
  review: "The new dark wallet interface is easier to scan. Balance, transfer actions, and transaction context feel clearer than before.",
};

export default function Testimonial() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-black text-base-content sm:text-4xl">What users notice first</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-base-content/65">
          The redesign is intentionally darker, simpler, and closer to a financial dashboard than a generic landing page.
        </p>
        <div className="relative mt-10 sm:mt-14">
          <button className="btn btn-outline btn-square absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-field md:flex" aria-label="Previous testimonial">
            <ArrowLeft size={16} />
          </button>
          <div className="mx-auto max-w-2xl rounded-box border border-base-300 bg-base-200 px-6 py-10 shadow-2xl sm:px-10 lg:px-12">
            <img src={TESTIMONIAL.avatarUrl} alt={TESTIMONIAL.name} className="mx-auto h-16 w-16 rounded-box border-2 border-primary/30 object-cover" />
            <h3 className="mt-4 text-xl font-black text-base-content">{TESTIMONIAL.name}</h3>
            <div className="mt-3 flex justify-center gap-1 text-warning" aria-label={`Rating: ${TESTIMONIAL.rating} out of 5`}>
              {"★".repeat(TESTIMONIAL.rating)}
              <span className="ml-2 text-sm text-base-content/70">{TESTIMONIAL.rating}.0</span>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-base-content/70">{TESTIMONIAL.review}</p>
          </div>
          <button className="btn btn-primary btn-square absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-field md:flex" aria-label="Next testimonial">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
