
import { DollarSign } from "lucide-react";

const features = [
  {
    title: "Invoice Tokenization",
    description: "Convert your invoices into tradable digital assets on the blockchain.",
    icon: <DollarSign className="h-10 w-10 text-fundora-cyan" />,
  },
  {
    title: "Instant Liquidity",
    description: "Access capital within minutes, not weeks, with our DeFi lending pools.",
    icon: <DollarSign className="h-10 w-10 text-fundora-blue" />,
  },
  {
    title: "Global Marketplace",
    description: "Connect with lenders worldwide for the best financing rates.",
    icon: <DollarSign className="h-10 w-10 text-fundora-pink" />,
  },
  {
    title: "Secure Contracts",
    description: "Smart contracts ensure transparent and immutable agreement terms.",
    icon: <DollarSign className="h-10 w-10 text-fundora-purple" />,
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 lg:py-24 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6 text-gradient">
            How It Works
          </h2>
          <p className="max-w-2xl mx-auto text-fundora-silver opacity-80">
            Our blockchain-powered platform connects exporters with global liquidity, 
            transforming how international trade is financed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-morphism rounded-xl p-6 group transition-all duration-300 
                hover:translate-y-[-5px] hover:shadow-[0_0_20px_rgba(0,123,255,0.15)]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-5 inline-block rounded-full p-3 bg-gradient-to-br from-fundora-blue/10 to-fundora-cyan/10">
                {feature.icon}
              </div>
              
              <h3 className="font-orbitron text-xl font-semibold mb-3 text-white group-hover:text-gradient transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-fundora-silver opacity-80 text-sm">
                {feature.description}
              </p>
              
              {/* Decorative element */}
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-fundora-blue/50 to-fundora-cyan/50 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
