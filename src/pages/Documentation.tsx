
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-fundora-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="glass-morphism p-3 rounded-full mr-4">
              <FileText className="h-8 w-8 text-fundora-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-orbitron text-gradient font-bold">
              Fundora Documentation
            </h1>
          </div>
          
          <section className="mb-16 glass-morphism p-6 md:p-10 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-orbitron mb-6 text-gradient">Problem & Solution</h2>
            <div className="space-y-4 text-lg">
              <p className="text-gray-300">
                <span className="text-fundora-cyan font-bold">Problem:</span> SMEs often have to wait up to 60 days to receive payment after fulfilling an order. 
                During this period, many struggle with limited access to the funds needed to begin production on new orders. 
                Traditional financing options like bank loans are typically slow, complex, and difficult to obtain.
              </p>
              <p className="text-gray-300">
                <span className="text-fundora-cyan font-bold">Solution:</span> Fundora is a platform that provides SMEs with upfront 
                funding for the duration of the invoice period, helping them maintain cash flow and continue 
                operations without disruption.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-orbitron mb-8 text-gradient">Platform Flow</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass-morphism rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-fundora-blue/20 to-fundora-cyan/20 p-4 border-b border-white/10">
                  <h3 className="text-xl font-orbitron text-white">Current Flow of Platform</h3>
                </div>
                <div className="p-6">
                  <img 
                    src="/lovable-uploads/ab6e7854-8ed2-4907-89df-b12c7ee9a9f5.png" 
                    alt="Current flow of platform" 
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="glass-morphism rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-fundora-blue/20 to-fundora-cyan/20 p-4 border-b border-white/10">
                  <h3 className="text-xl font-orbitron text-white">Invoice Funding Process</h3>
                </div>
                <div className="p-6">
                  <img 
                    src="/lovable-uploads/17df67d7-3495-4427-bc85-9e9f3f6565e3.png" 
                    alt="Invoice funding process" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16 glass-morphism p-6 md:p-10 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-orbitron mb-6 text-gradient">How It Works</h2>
            <ol className="space-y-6 list-decimal list-inside text-lg">
              <li className="text-gray-300">
                <span className="text-white font-semibold">SME uploads invoice details</span> - These include the invoice amount, duration, and other relevant information.
              </li>
              <li className="text-gray-300">
                <span className="text-white font-semibold">The invoice is tokenized</span> - The invoice is used to mint a digital object (NFT) on the Base Sepolia testnet.
              </li>
              <li className="text-gray-300">
                <span className="text-white font-semibold">Minted invoices listed on dashboard</span> - All tokenized invoices are displayed on the platform dashboard.
              </li>
              <li className="text-gray-300">
                <span className="text-white font-semibold">Investor selection</span> - Investors can choose to invest in specific minted invoices.
              </li>
              <li className="text-gray-300">
                <span className="text-white font-semibold">SME receives funds</span> - After investment, the SME receives the funds in stablecoins.
              </li>
              <li className="text-gray-300">
                <span className="text-white font-semibold">Repayment</span> - The SME repays the borrowed amount plus interest within the specified period.
              </li>
            </ol>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-orbitron mb-8 text-gradient">Repayment Process</h2>
            
            <div className="glass-morphism rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-fundora-blue/20 to-fundora-cyan/20 p-4 border-b border-white/10">
                <h3 className="text-xl font-orbitron text-white">Repayment and Default Flow</h3>
              </div>
              <div className="p-6">
                <img 
                  src="/lovable-uploads/09858cfa-280f-489e-8e70-3f62b7ee4155.png" 
                  alt="Repayment and default flow" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass-morphism p-6 md:p-8 rounded-xl">
                <h2 className="text-2xl font-orbitron mb-6 text-gradient">Future Scope</h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-fundora-blue to-fundora-cyan flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-xs font-bold">✓</span>
                    </div>
                    <span>Invoice interest proposals will require approval by a manager to ensure fairness.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-fundora-blue to-fundora-cyan flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-xs font-bold">✓</span>
                    </div>
                    <span>Investors will be able to trade minted invoices (temporarily changing ownership).</span>
                  </li>
                </ul>
              </div>

              <div className="glass-morphism p-6 md:p-8 rounded-xl">
                <h2 className="text-2xl font-orbitron mb-6 text-gradient">Technical Details</h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-fundora-blue to-fundora-cyan flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-xs font-bold">✓</span>
                    </div>
                    <span>All transactions will be done via stablecoins.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-fundora-blue to-fundora-cyan flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-xs font-bold">✓</span>
                    </div>
                    <span>Currently supports Metamask wallet, with plans to support additional wallets in the future.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Documentation;
