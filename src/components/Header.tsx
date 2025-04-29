
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-6 relative z-50">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/76c9814c-8024-4b1e-98f1-8f8d20e9aee4.png" 
            alt="Fundora Logo" 
            className="h-16 md:h-20"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-5">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="glass-morphism transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,123,255,0.5)]"
            >
              About Us
            </Button>
            <Button 
              variant="outline" 
              className="glass-morphism transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            >
              Login
            </Button>
            <Button 
              className="bg-gradient-to-r from-fundora-blue to-fundora-cyan text-white animate-pulse-glow transition-all duration-300 hover:scale-105"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white p-2 glass-morphism rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-morphism py-4 animate-slide-in">
          <div className="flex flex-col space-y-3 px-4">
            <Button 
              variant="outline" 
              className="glass-morphism transition-all duration-300 hover:bg-white/10"
            >
              About Us
            </Button>
            <Button 
              variant="outline" 
              className="glass-morphism transition-all duration-300 hover:bg-white/10"
            >
              Login
            </Button>
            <Button 
              className="bg-gradient-to-r from-fundora-blue to-fundora-cyan text-white"
            >
              Create Account
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
