
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import FloatingElements from "@/components/FloatingElements";
import { FileUp, DollarSign } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Check if user is logged in
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // If not logged in, don't render anything
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-fundora-dark">
      {/* Dashboard Sidebar */}
      <DashboardSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        <FloatingElements />
        
        <div className="relative z-10 p-6 md:p-10 h-full">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-orbitron text-gradient">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-300 mt-2">
              What would you like to do today?
            </p>
          </header>
          
          <main>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-morphism border border-fundora-blue/30 p-6 rounded-lg hover:border-fundora-blue transition-all transform hover:-translate-y-1 hover:shadow-xl">
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
              
              <div className="glass-morphism border border-fundora-blue/30 p-6 rounded-lg hover:border-fundora-blue transition-all transform hover:-translate-y-1 hover:shadow-xl">
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
