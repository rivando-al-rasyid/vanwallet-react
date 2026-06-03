/**
 * App.jsx - Main application component for the landing page
 *
 * This component renders the public-facing landing page with all marketing sections.
 * It includes navigation, hero section, features, about section, and footer.
 */

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
    <div className="min-h-screen bg-white font-sans text-gray-800">
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
