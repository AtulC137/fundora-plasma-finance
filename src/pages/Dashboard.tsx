
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import { FileUp, DollarSign } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const user = localStorage.getItem("user");
  const isLoggedIn = user !== null;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const userData = JSON.parse(user || "{}");

  return (
    <div className="min-h-screen bg-fundora-dark text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-orbitron text-gradient mb-6">
              Welcome to Your Dashboard
            </h1>
            
            <p className="text-gray-300 mb-10">
              Hello {userData.email}! What would you like to do today?
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-morphism border border-fundora-blue/30 p-6 rounded-lg hover:border-fundora-blue transition-all">
                <FileUp className="mb-4 text-fundora-cyan h-12 w-12" />
                <h2 className="text-xl font-orbitron text-gradient mb-3">Mint Invoice</h2>
                <p className="text-gray-300 mb-4">
                  Create and mint new invoices as an SME user. Upload your invoice details and make it available for investors.
                </p>
                <Button 
                  onClick={() => navigate("/invoice?tab=sme")} 
                  className="bg-gradient-to-r from-fundora-blue to-fundora-cyan"
                >
                  Start Minting
                </Button>
              </div>
              
              <div className="glass-morphism border border-fundora-blue/30 p-6 rounded-lg hover:border-fundora-blue transition-all">
                <DollarSign className="mb-4 text-fundora-cyan h-12 w-12" />
                <h2 className="text-xl font-orbitron text-gradient mb-3">Invest in Invoices</h2>
                <p className="text-gray-300 mb-4">
                  Browse available invoices to invest in. View details and make investment decisions.
                </p>
                <Button 
                  onClick={() => navigate("/invoice?tab=investor")} 
                  className="bg-gradient-to-r from-fundora-blue to-fundora-cyan"
                >
                  Browse Invoices
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
