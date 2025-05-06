
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import ChatSidebar from "@/components/ChatSidebar";
import FloatingElements from "@/components/FloatingElements";
import { FileUp, DollarSign, Search, Filter, Home, User, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import SmallInvoiceForm from "@/components/SmallInvoiceForm";
import InvoiceList from "@/components/InvoiceList";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("create");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Toggle chat sidebar
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  // Check if user is logged in
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      // Set default active tab based on user role
      if (parsedUser.role === "investor") {
        setActiveTab("invest");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // If not logged in, don't render anything
  if (!user) {
    return null;
  }

  // Get number of invoices
  const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
  const userInvoices = invoices.filter((invoice: any) => 
    (user.role === "sme" && invoice.ethName === user.username) ||
    (user.role === "investor" && invoice.investor === user.username)
  );

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount) || 0);
  };

  // Calculate total value of invoices
  const calculateTotalValue = () => {
    return userInvoices.reduce((total: number, invoice: any) => {
      return total + (parseFloat(invoice.amount) || 0);
    }, 0);
  };

  return (
    <div className="h-screen flex bg-fundora-dark">
      {/* Dashboard Sidebar */}
      <DashboardSidebar user={user} onToggleChat={toggleChat} />
      
      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={toggleChat} user={user} />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-auto relative transition-all ${isChatOpen ? 'md:mr-80' : ''}`}>
        <FloatingElements />
        
        <div className="relative z-10 p-6 md:p-10 h-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-orbitron text-gradient">
              {user.role === "sme" ? "SME Dashboard" : "Investor Dashboard"}
            </h1>
            <p className="text-gray-300 mt-2">
              {user.role === "sme" 
                ? "Create and manage your invoices for funding" 
                : "Browse and invest in available invoices"}
            </p>
          </header>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-morphism border border-fundora-blue/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-fundora-blue/20">
                    <FileUp className="h-6 w-6 text-fundora-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      {user.role === "sme" ? "Your Invoices" : "Investments"}
                    </p>
                    <h3 className="text-2xl font-semibold text-white">
                      {userInvoices.length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-morphism border border-fundora-blue/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-fundora-blue/20">
                    <DollarSign className="h-6 w-6 text-fundora-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Value</p>
                    <h3 className="text-2xl font-semibold text-white">
                      {formatCurrency(calculateTotalValue().toString())}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-morphism border border-fundora-blue/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-fundora-blue/20">
                    <Wallet className="h-6 w-6 text-fundora-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Wallet Balance</p>
                    <h3 className="text-2xl font-semibold text-white">
                      {formatCurrency("5000")} {/* Placeholder value */}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <main>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="max-w-5xl"
            >
              <TabsList className={`grid w-full ${user.role === "sme" ? "grid-cols-2" : "grid-cols-2"} glass-morphism mb-6`}>
                {user.role === "sme" ? (
                  <>
                    <TabsTrigger 
                      value="create"
                      className="py-3 data-[state=active]:text-gradient data-[state=active]:font-semibold"
                    >
                      <FileUp className="mr-2 h-4 w-4" /> Create Invoice
                    </TabsTrigger>
                    <TabsTrigger 
                      value="manage"
                      className="py-3 data-[state=active]:text-gradient data-[state=active]:font-semibold"
                    >
                      <DollarSign className="mr-2 h-4 w-4" /> My Invoices
                    </TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger 
                      value="invest"
                      className="py-3 data-[state=active]:text-gradient data-[state=active]:font-semibold"
                    >
                      <DollarSign className="mr-2 h-4 w-4" /> Invest in Invoices
                    </TabsTrigger>
                    <TabsTrigger 
                      value="portfolio"
                      className="py-3 data-[state=active]:text-gradient data-[state=active]:font-semibold"
                    >
                      <FileUp className="mr-2 h-4 w-4" /> My Investments
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* SME Tabs */}
              {user.role === "sme" && (
                <>
                  <TabsContent value="create" className="mt-0">
                    <Card className="glass-morphism border border-fundora-blue/30">
                      <CardContent className="pt-6">
                        <SmallInvoiceForm user={user} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="manage" className="mt-0">
                    <Card className="glass-morphism border border-fundora-blue/30">
                      <CardContent className="pt-6">
                        <InvoiceList userRole="sme" username={user.username} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}

              {/* Investor Tabs */}
              {user.role === "investor" && (
                <>
                  <TabsContent value="invest" className="mt-0">
                    <Card className="glass-morphism border border-fundora-blue/30">
                      <CardContent className="pt-6">
                        <InvoiceList userRole="investor" />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="portfolio" className="mt-0">
                    <Card className="glass-morphism border border-fundora-blue/30">
                      <CardContent className="pt-6">
                        <InvoiceList userRole="investor" portfolioOnly={true} username={user.username} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
