
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, Search, Filter, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface InvoiceListProps {
  userRole: "sme" | "investor";
  username?: string;
  portfolioOnly?: boolean;
}

const InvoiceList = ({ userRole, username, portfolioOnly = false }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");

  useEffect(() => {
    // Load invoices from localStorage
    const storedInvoices = localStorage.getItem("invoices");
    if (storedInvoices) {
      const parsedInvoices = JSON.parse(storedInvoices);
      
      // Filter based on user role and requirements
      let filtered = parsedInvoices;
      
      if (userRole === "sme" && username) {
        // Show only this SME's invoices
        filtered = parsedInvoices.filter((invoice: any) => 
          invoice.ethName === username
        );
      } else if (userRole === "investor" && portfolioOnly && username) {
        // Show only invoices the investor has invested in
        filtered = parsedInvoices.filter((invoice: any) => 
          invoice.investor === username
        );
      } else if (userRole === "investor" && !portfolioOnly) {
        // Show available invoices for investment
        filtered = parsedInvoices.filter((invoice: any) => 
          invoice.status === "Available"
        );
      }
      
      setInvoices(filtered);
      setFilteredInvoices(filtered);
    }
  }, [userRole, username, portfolioOnly]);

  // Apply filters whenever search term or filters change
  useEffect(() => {
    let result = [...invoices];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        invoice => 
          (invoice.title && invoice.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (invoice.ethName && invoice.ethName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (invoice.realName && invoice.realName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        invoice => invoice.status && invoice.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply amount filter
    if (amountFilter !== "all") {
      const [min, max] = amountFilter.split("-").map(Number);
      result = result.filter(invoice => {
        const amount = parseFloat(invoice.amount);
        if (max) {
          return amount >= min && amount <= max;
        } else {
          return amount >= min;
        }
      });
    }
    
    setFilteredInvoices(result);
  }, [searchTerm, statusFilter, amountFilter, invoices]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount) || 0);
  };

  const handleViewDetails = (invoice: any) => {
    // For now, just show a toast with invoice details
    toast.info(`Viewing invoice: ${invoice.title || 'Untitled'}`);
  };

  const handleInvest = (invoice: any) => {
    // Update the invoice's status and investor
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoice.id) {
        return {
          ...inv,
          status: "Funded",
          investor: username,
          investedAt: new Date().toISOString()
        };
      }
      return inv;
    });
    
    // Update state and localStorage
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    
    toast.success("Investment successful!");
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
        <Select 
          value={amountFilter} 
          onValueChange={setAmountFilter}
        >
          <SelectTrigger className="w-[180px] bg-white/10 border-fundora-blue/30 text-white">
            <SelectValue placeholder="Filter by amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Amounts</SelectItem>
            <SelectItem value="0-1000">$0 - $1,000</SelectItem>
            <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
            <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
            <SelectItem value="10000-50000">$10,000 - $50,000</SelectItem>
            <SelectItem value="50000">$50,000+</SelectItem>
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
              (userRole === "sme" ? 
                "Create your first invoice to get started." : 
                "No invoices available for investment at the moment.") : 
              "No invoices match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInvoices.map((invoice) => (
            <Card 
              key={invoice.id} 
              className="bg-white/5 border border-fundora-blue/30 hover:border-fundora-blue transition-all"
            >
              <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{invoice.title || `Invoice #${invoice.id.substring(0, 6)}`}</h3>
                    <Badge className={
                      invoice.status === "Available" ? "bg-green-500/70" :
                      invoice.status === "Funded" ? "bg-blue-500/70" :
                      "bg-purple-500/70"
                    }>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    Creator: {invoice.ethName || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Duration: {invoice.duration || "30"} days
                  </p>
                </div>
                <div className="mt-2 md:mt-0 flex flex-col md:items-end">
                  <span className="font-semibold text-white">
                    {formatCurrency(invoice.amount || "0")}
                  </span>
                  
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline" 
                      size="sm"
                      className="text-xs glass-morphism"
                      onClick={() => handleViewDetails(invoice)}
                    >
                      View Details
                    </Button>
                    
                    {userRole === "investor" && invoice.status === "Available" && !portfolioOnly && (
                      <Button
                        size="sm"
                        className="text-xs bg-gradient-to-r from-fundora-blue to-fundora-cyan"
                        onClick={() => handleInvest(invoice)}
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Invest
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
