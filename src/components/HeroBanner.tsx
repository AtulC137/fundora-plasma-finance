
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-fundora-blue/10 to-transparent opacity-40"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-fundora-blue/10 rounded-full filter blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-fundora-cyan/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient">
            Empowering Exporters Through DeFi
          </h1>
          
          <p className="font-poppins text-lg md:text-xl text-fundora-silver mb-10 opacity-90">
            Tokenized invoice financing with instant access to capital.
          </p>
          
          <div className="inline-block relative">
            <Button 
              className="bg-gradient-to-r from-fundora-blue to-fundora-cyan text-white text-lg font-semibold py-6 px-8 rounded-lg animate-pulse-glow transition-all duration-300 hover:scale-105 group"
            >
              <span className="flex items-center">
                <DollarSign className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Get Started
              </span>
            </Button>
            
            {/* Subtle glow effect behind button */}
            <div className="absolute -inset-1 bg-gradient-to-r from-fundora-blue/20 to-fundora-cyan/20 rounded-lg blur"></div>
          </div>
          
          <div className="mt-12 flex justify-center gap-x-6">
            <div className="glass-morphism p-4 rounded-lg">
              <p className="text-3xl font-orbitron text-fundora-cyan font-bold">$250M+</p>
              <p className="text-sm text-gray-300">Capital Financed</p>
            </div>
            <div className="glass-morphism p-4 rounded-lg">
              <p className="text-3xl font-orbitron text-fundora-pink font-bold">2.5K+</p>
              <p className="text-sm text-gray-300">Exporters Funded</p>
            </div>
            <div className="glass-morphism p-4 rounded-lg">
              <p className="text-3xl font-orbitron text-fundora-purple font-bold">30+</p>
              <p className="text-sm text-gray-300">Countries Served</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
