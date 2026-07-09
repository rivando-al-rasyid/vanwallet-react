import Navbar from "./layouts/Navbar";
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import About from "./components/home/About";
import FeatureList from "./components/home/FeatureList";
import Partners from "./components/home/Partners";
import Testimonial from "./components/home/Testimonial";
import DownloadCTA from "./components/home/DownloadCTA";
import Footer from "./layouts/Footer";

function App() {
  return (
    <div className="bg-base-100 text-base-content min-h-screen font-sans">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,color-mix(in_oklch,var(--color-primary)_26%,transparent),transparent_30%),radial-gradient(circle_at_85%_5%,color-mix(in_oklch,var(--color-secondary)_18%,transparent),transparent_26%),linear-gradient(180deg,var(--color-base-100),var(--color-base-200))]" />
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <Features />
        <About />
        <FeatureList />
        <Partners />
        <Testimonial />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
