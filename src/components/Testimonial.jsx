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
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl lg:text-4xl">
          What Our Users Are Saying
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7">
          Ready to experience the future of payments? Download e-wallet now and
          enjoy a world of convenience at your fingertips.
        </p>

        <div className="relative mt-8 sm:mt-14">
          <button
            className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow md:flex lg:h-11 lg:w-11"
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="mx-auto max-w-2xl rounded-2xl bg-blue-600 px-6 py-8 text-white shadow-2xl sm:rounded-3xl sm:px-8 sm:py-10 lg:px-12">
            <img
              src={TESTIMONIAL.avatarUrl}
              alt={TESTIMONIAL.name}
              className="mx-auto h-12 w-12 rounded-full border-3 border-white/20 object-cover sm:h-16 sm:w-16 sm:border-4"
            />
            <h3 className="mt-3 text-lg font-semibold sm:mt-4 sm:text-xl">{TESTIMONIAL.name}</h3>
            <div
              className="mt-2 flex justify-center gap-1 text-yellow-300 sm:mt-3"
              aria-label={`Rating: ${TESTIMONIAL.rating} out of 5`}
            >
              {"★".repeat(TESTIMONIAL.rating)}
              <span className="ml-2 text-xs text-white/80 sm:ml-2 sm:text-sm">
                {TESTIMONIAL.rating}.0
              </span>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/90 sm:mt-6 sm:text-base sm:leading-7">
              {TESTIMONIAL.review}
            </p>
          </div>

          <button
            className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow md:flex lg:h-11 lg:w-11"
            aria-label="Next testimonial"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
