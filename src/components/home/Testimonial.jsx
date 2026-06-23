import { ArrowLeft, ArrowRight } from "lucide-react";

const TESTIMONIAL = {
  name: "James Bond",
  avatarUrl: "https://i.pravatar.cc/100?img=12",
  rating: 5,
  review: "I've been using the e-wallet for over two years now, and I'm very satisfied with the ease of use. This has completely changed the way I shop and conduct financial transactions.",
};

export default function Testimonial() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">What Our Users Are Saying</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">A more premium testimonial block that matches the new product color system.</p>
        <div className="relative mt-10 sm:mt-14">
          <button className="absolute top-1/2 left-0 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow md:flex" aria-label="Previous testimonial"><ArrowLeft size={16} /></button>
          <div className="mx-auto max-w-2xl rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10 lg:px-12">
            <img src={TESTIMONIAL.avatarUrl} alt={TESTIMONIAL.name} className="mx-auto h-16 w-16 rounded-2xl border-2 border-white/20 object-cover" />
            <h3 className="mt-4 text-xl font-black">{TESTIMONIAL.name}</h3>
            <div className="mt-3 flex justify-center gap-1 text-amber-300" aria-label={`Rating: ${TESTIMONIAL.rating} out of 5`}>
              {"★".repeat(TESTIMONIAL.rating)}<span className="ml-2 text-sm text-white/70">{TESTIMONIAL.rating}.0</span>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-300">{TESTIMONIAL.review}</p>
          </div>
          <button className="absolute top-1/2 right-0 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow md:flex" aria-label="Next testimonial"><ArrowRight size={16} /></button>
        </div>
      </div>
    </section>
  );
}
