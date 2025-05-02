
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import WalletConnect from '@/components/WalletConnect';
import ProfileButton from '@/components/ProfileButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUsername(userData.email || "User");
    }
  }, []);

  // Handler for successful account creation
  const handleAccountCreated = (newUsername: string) => {
    setUsername(newUsername);
    setIsLoggedIn(true);
    setDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/invoice");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="w-full py-6 relative z-50">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/006089d8-3939-4856-b7bb-dd754b0fe3b7.png" 
            alt="Fundora Logo" 
            className="h-16 md:h-20 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="glass-morphism"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          
          {isLoggedIn && (
            <Button 
              variant="outline" 
              className="glass-morphism"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="glass-morphism"
          >
            About Us
          </Button>
          
          {!isLoggedIn ? (
            <>
              <Button 
                variant="outline" 
                className="glass-morphism"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-fundora-blue to-fundora-cyan text-white"
                  >
                    Create Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-morphism border border-fundora-blue/30 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-orbitron text-gradient">Connect Your Wallet</DialogTitle>
                    <DialogDescription className="text-center text-gray-300">
                      Select a wallet to create your account
                    </DialogDescription>
                  </DialogHeader>
                  <WalletConnect onAccountCreated={handleAccountCreated} />
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <ProfileButton username={username} onLogout={handleLogout} />
          )}
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
              className="glass-morphism"
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              Home
            </Button>
            
            {isLoggedIn && (
              <Button 
                variant="outline" 
                className="glass-morphism"
                onClick={() => {
                  navigate("/dashboard");
                  setIsMenuOpen(false);
                }}
              >
                Dashboard
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="glass-morphism"
            >
              About Us
            </Button>
            
            {!isLoggedIn ? (
              <>
                <Button 
                  variant="outline" 
                  className="glass-morphism"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-to-r from-fundora-blue to-fundora-cyan text-white"
                    >
                      Create Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-morphism border border-fundora-blue/30 max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-orbitron text-gradient">Connect Your Wallet</DialogTitle>
                      <DialogDescription className="text-center text-gray-300">
                        Select a wallet to create your account
                      </DialogDescription>
                    </DialogHeader>
                    <WalletConnect onAccountCreated={handleAccountCreated} />
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="glass-morphism"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
