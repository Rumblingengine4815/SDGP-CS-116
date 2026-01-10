import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import FeatureTimeline from "./components/FeatureTimeline";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section
        id="features"
      >
        
      <Features />
      <FeatureTimeline />
      </section>

      {/* About Section
      <section
        id="about"
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <h2 className="text-4xl font-semibold">About Pathfinder+</h2>
      </section> */}

      <Footer />
    </>
  );
}
