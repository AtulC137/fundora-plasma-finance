
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import ChatSidebar from "@/components/ChatSidebar";
import FloatingElements from "@/components/FloatingElements";
import { FileUp, DollarSign, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// Small Invoice Form Component
const SmallInvoiceForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form using react-hook-form
  const form = useForm({
    defaultValues: {
      title: "",
      sender: "",
      receiver: "",
      amount: "",
    }
  });

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);

    // Validate form
    if (!values.title || !values.sender || !values.receiver || !values.amount) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    // Create new invoice object
    const newInvoice = {
      id: Date.now().toString(),
      ...values,
      status: "Available",
      createdAt: new Date().toISOString(),
    };

    // Get existing invoices
    const existingInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    
    // Add new invoice
    existingInvoices.push(newInvoice);
    
    // Save to localStorage
    localStorage.setItem("invoices", JSON.stringify(existingInvoices));
    
    toast.success("Invoice created successfully!");
    
    // Reset form
    form.reset({
      title: "",
      sender: "",
      receiver: "",
      amount: "",
    });
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Invoice Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter invoice title"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  {...field}
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">From (Sender)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Sender name"
                    className="bg-white/10 border-fundora-blue/30 text-white"
                    {...field}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="receiver"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">To (Receiver)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Receiver name"
                    className="bg-white/10 border-fundora-blue/30 text-white"
                    {...field}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Amount (USD)</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="bg-white/10 border-fundora-blue/30 text-white pl-10"
                    {...field}
                    required
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-fundora-blue to-fundora-cyan"
          disabled={isSubmitting}
        >
          <FileUp className="mr-2 h-4 w-4" />
          {isSubmitting ? "Creating..." : "Create Invoice"}
        </Button>
      </form>
    </Form>
  );
};

// Invoice List Component with Filtering
const InvoiceList = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Load invoices from localStorage
    const storedInvoices = localStorage.getItem("invoices");
    if (storedInvoices) {
      const parsedInvoices = JSON.parse(storedInvoices);
      setInvoices(parsedInvoices);
      setFilteredInvoices(parsedInvoices);
    }
  }, []);

  // Apply filters whenever search term or status filter changes
  useEffect(() => {
    let result = [...invoices];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        invoice => 
          invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.receiver.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        invoice => invoice.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredInvoices(result);
  }, [searchTerm, statusFilter, invoices]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const handleViewDetails = (invoice: any) => {
    // For now, just show a toast with invoice details
    toast.info(`Viewing invoice: ${invoice.title}`);
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search invoices..." 
            className="bg-white/10 border-fundora-blue/30 text-white pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px] bg-white/10 border-fundora-blue/30 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="funded">Funded</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-10">
          <FileUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-orbitron text-gradient mb-2">No Invoices Found</h3>
          <p className="text-gray-300 max-w-md mx-auto">
            {invoices.length === 0 ? 
              "Create your first invoice to get started." : 
              "No invoices match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInvoices.map((invoice) => (
            <Card 
              key={invoice.id} 
              className="bg-white/5 border border-fundora-blue/30 hover:border-fundora-blue transition-all"
              onClick={() => handleViewDetails(invoice)}
            >
              <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer">
                <div className="space-y-1">
                  <h3 className="font-medium text-white">{invoice.title}</h3>
                  <p className="text-sm text-gray-400">{invoice.sender} → {invoice.receiver}</p>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col md:items-end">
                  <span className="font-semibold text-white">
                    {formatCurrency(invoice.amount)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    invoice.status === "Available" ? "bg-green-500/20 text-green-400" :
                    invoice.status === "Funded" ? "bg-blue-500/20 text-blue-400" : 
                    "bg-purple-500/20 text-purple-400"
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("sme");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Toggle chat sidebar
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
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
      <DashboardSidebar user={user} onToggleChat={toggleChat} />
      
      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={toggleChat} user={user} />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-auto relative transition-all ${isChatOpen ? 'md:mr-80' : ''}`}>
        <FloatingElements />
        
        <div className="relative z-10 p-6 md:p-10 h-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-orbitron text-gradient">
              Your Dashboard
            </h1>
            <p className="text-gray-300 mt-2">
              Create and manage invoices or invest in available opportunities
            </p>
          </header>
          
          <main>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="max-w-5xl"
            >
              <TabsList className="grid w-full grid-cols-2 glass-morphism mb-6">
                <TabsTrigger 
                  value="sme"
                  className="py-3 data-[state=active]:text-gradient data-[state=active]:font-semibold"
                >
                  <FileUp className="mr-2 h-4 w-4" /> Create Invoice
                </TabsTrigger>
                <TabsTrigger 
                  value="investor"
                  className="py-3 data-[state=active]:text-gradient data-[state=active]:font-semibold"
                >
                  <DollarSign className="mr-2 h-4 w-4" /> Invest in Invoices
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sme" className="mt-0">
                <Card className="glass-morphism border border-fundora-blue/30">
                  <CardContent className="pt-6">
                    <SmallInvoiceForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investor" className="mt-0">
                <Card className="glass-morphism border border-fundora-blue/30">
                  <CardContent className="pt-6">
                    <InvoiceList />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
