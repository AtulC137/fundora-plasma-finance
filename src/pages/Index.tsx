
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FeatureSection from "@/components/FeatureSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

const Index = () => {
  return (
    <div className="min-h-screen bg-fundora-dark text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10">
        <Header />
        <main>
          <HeroBanner />
          <FeatureSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
