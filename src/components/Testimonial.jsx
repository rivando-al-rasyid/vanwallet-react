import { ArrowLeft, ArrowRight } from "lucide-react";

const TESTIMONIAL = {
  name: "James Bond",
  avatarUrl: "https://i.pravatar.cc/100?img=12",
  rating: 5,
  review:
    "I've been using the e-wallet for over two years now, and I'm very satisfied with the ease of use. This has completely changed the way I shop and conduct financial transactions.",
};

export default function Testimonial() {
  return (
    <section className="px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-4xl font-semibold text-gray-900">
          What Our Users Are Saying
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
          Ready to experience the future of payments? Download e-wallet now and
          enjoy a world of convenience at your fingertips.
        </p>

        <div className="relative mt-14">
          <button
            className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow md:flex"
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="mx-auto max-w-2xl rounded-3xl bg-blue-600 px-8 py-10 text-white shadow-2xl lg:px-12">
            <img
              src={TESTIMONIAL.avatarUrl}
              alt={TESTIMONIAL.name}
              className="mx-auto h-16 w-16 rounded-full border-4 border-white/20 object-cover"
            />
            <h3 className="mt-4 text-xl font-semibold">{TESTIMONIAL.name}</h3>
            <div
              className="mt-3 flex justify-center gap-1 text-yellow-300"
              aria-label={`Rating: ${TESTIMONIAL.rating} out of 5`}
            >
              {"★".repeat(TESTIMONIAL.rating)}
              <span className="ml-2 text-sm text-white/80">
                {TESTIMONIAL.rating}.0
              </span>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/90">
              {TESTIMONIAL.review}
            </p>
          </div>

          <button
            className="absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow md:flex"
            aria-label="Next testimonial"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
