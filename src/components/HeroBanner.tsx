
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroBanner = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    const user = localStorage.getItem("user");
    
    if (user) {
      // If logged in, go to dashboard
      navigate("/dashboard");
    } else {
      // If not logged in, go to login page
      navigate("/login");
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-8 glow-text">
            <span className="text-gradient">Fundora</span> Finance
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10">
            Revolutionizing financial markets with blockchain technology.
            Secure, transparent, and efficient solutions for all your financial needs.
          </p>
          
          <Button 
            onClick={handleGetStarted}
            className="py-6 px-10 text-lg bg-gradient-to-r from-fundora-blue to-fundora-cyan hover:opacity-90 transition-all transform hover:-translate-y-1"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
