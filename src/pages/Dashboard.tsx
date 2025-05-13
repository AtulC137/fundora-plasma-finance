
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
import InvestmentsList from "@/components/InvestmentsList";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DB_KEYS } from "@/types/database";

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
    const userInfo = localStorage.getItem(DB_KEYS.USER);
    
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      // Set default active tab based on user account type
      if (parsedUser.account_type === "Investor") {
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
  const invoices = JSON.parse(localStorage.getItem(DB_KEYS.INVOICES) || "[]");
  const userInvoices = invoices.filter((invoice: any) => 
    (user.account_type === "SME" && invoice.userId === user.id)
  );

  // Get number of investments
  const investments = JSON.parse(localStorage.getItem(DB_KEYS.INVESTMENTS) || "[]");
  const userInvestments = investments.filter((investment: any) => 
    (user.account_type === "Investor" && investment.investor_id === user.id) ||
    (user.account_type === "SME" && userInvoices.some((invoice: any) => invoice.id === investment.invoice_id))
  );

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount) || 0);
  };

  // Calculate total value of invoices or investments
  const calculateTotalValue = () => {
    if (user.account_type === "SME") {
      return userInvoices.reduce((total: number, invoice: any) => {
        return total + (parseFloat(invoice.amount) || 0);
      }, 0);
    } else {
      return userInvestments.reduce((total: number, investment: any) => {
        return total + (parseFloat(investment.amount) || 0);
      }, 0);
    }
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
              {user.account_type === "SME" ? "SME Dashboard" : "Investor Dashboard"}
            </h1>
            <p className="text-gray-300 mt-2">
              {user.account_type === "SME" 
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
                      {user.account_type === "SME" ? "Your Invoices" : "Your Investments"}
                    </p>
                    <h3 className="text-2xl font-semibold text-white">
                      {user.account_type === "SME" ? userInvoices.length : userInvestments.length}
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
              <TabsList className={`grid w-full ${user.account_type === "SME" ? "grid-cols-3" : "grid-cols-3"} glass-morphism mb-6`}>
                {user.account_type === "SME" ? (
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
                    <TabsTrigger 
                      value="investments"
                      className="py-3 data-[state=active]:text-gradient data-[state=active]:font-semibold"
                    >
                      <Wallet className="mr-2 h-4 w-4" /> Investments
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
                    <TabsTrigger 
                      value="investments"
                      className="py-3 data-[state=active]:text-gradient data-[state=active]:font-semibold"
                    >
                      <Wallet className="mr-2 h-4 w-4" /> Investment Details
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* SME Tabs */}
              {user.account_type === "SME" && (
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
                        <InvoiceList userRole="sme" userId={user.id} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="investments" className="mt-0">
                    <Card className="glass-morphism border border-fundora-blue/30">
                      <CardContent className="pt-6">
                        <InvestmentsList userId={user.id} userRole="sme" />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}

              {/* Investor Tabs */}
              {user.account_type === "Investor" && (
                <>
                  <TabsContent value="invest" className="mt-0">
                    <Card className="glass-morphism border border-fundora-blue/30">
                      <CardContent className="pt-6">
                        <InvoiceList userRole="investor" userId={user.id} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="portfolio" className="mt-0">
                    <Card className="glass-morphism border border-fundora-blue/30">
                      <CardContent className="pt-6">
                        <InvoiceList userRole="investor" userId={user.id} portfolioOnly={true} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="investments" className="mt-0">
                    <Card className="glass-morphism border border-fundora-blue/30">
                      <CardContent className="pt-6">
                        <InvestmentsList userId={user.id} userRole="investor" />
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
