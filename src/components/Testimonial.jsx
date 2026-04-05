// Testimonial.jsx
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-4xl font-semibold text-gray-900">
          What Our Users Are Saying
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
          Ready to experience the future of payments? Download e-wallet now
          and enjoy a world of convenience at your fingertips.
        </p>

        <div className="relative mt-14">
          <button className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow md:flex">
            <ArrowLeft size={18} />
          </button>

          <div className="mx-auto max-w-2xl rounded-3xl bg-blue-600 px-8 py-10 text-white shadow-2xl lg:px-12">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="James Bond"
              className="mx-auto h-16 w-16 rounded-full border-4 border-white/20 object-cover"
            />
            <h3 className="mt-4 text-xl font-semibold">James Bond</h3>
            <div className="mt-3 flex justify-center gap-1 text-yellow-300">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s}>★</span>
              ))}
              <span className="ml-2 text-sm text-white/80">5.0</span>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/90">
              I\'ve been using the e-wallet for over two years now, and I\'m
              very satisfied with the ease of use. This has completely changed
              the way I shop and conduct financial transactions.
            </p>
          </div>

          <button className="absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow md:flex">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
