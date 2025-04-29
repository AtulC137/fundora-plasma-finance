
const Footer = () => {
  return (
    <footer className="py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <img 
              src="/lovable-uploads/006089d8-3939-4856-b7bb-dd754b0fe3b7.png" 
              alt="Fundora Logo" 
              className="h-12"
            />
            <p className="font-comic text-sm text-fundora-silver mt-2">
              Instant Working Capital for Exporters
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div>
              <h4 className="font-orbitron text-fundora-cyan font-medium mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-blue transition-colors">Invoice Funding</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-blue transition-colors">For Investors</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-blue transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-blue transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-orbitron text-fundora-pink font-medium mb-3">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-pink transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-pink transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-pink transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-pink transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-orbitron text-fundora-purple font-medium mb-3">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-purple transition-colors">Twitter</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-purple transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-purple transition-colors">Discord</a></li>
                <li><a href="#" className="text-sm text-gray-300 hover:text-fundora-purple transition-colors">Telegram</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Fundora Finance. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
