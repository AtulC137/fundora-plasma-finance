
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FeatureSection from "@/components/FeatureSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import DocumentationButton from "@/components/DocumentationButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-fundora-dark text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10">
        <Header />
        <main>
          <HeroBanner />
          <section className="py-8">
            <div className="container mx-auto px-4 flex justify-center">
              <DocumentationButton className="py-6 px-8 text-lg" />
            </div>
          </section>
          <FeatureSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
