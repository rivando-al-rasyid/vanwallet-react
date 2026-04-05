// App.jsx - Main entry point
import Navbar from "./layouts/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import FeatureList from "./components/FeatureList";
import Partners from "./components/Partners";
import Testimonial from "./components/Testimonial";
import DownloadCTA from "./components/DownloadCTA";
import Footer from "./layouts/Footer";
function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-800">
        <Hero />
        <Features />
        <About />
        <FeatureList />
        <Partners />
        <Testimonial />
        <DownloadCTA />
        <Footer />
      </div>
    </>
  );
}

export default App;
