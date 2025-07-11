
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, Search, Filter, DollarSign, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DB_KEYS, Invoice, Investment } from "@/types/database";
import { format } from "date-fns";

interface InvoiceListProps {
  userRole: "sme" | "investor";
  username?: string;
  userId?: string;
  portfolioOnly?: boolean;
}

const InvoiceList = ({ userRole, username, userId, portfolioOnly = false }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");

  // Load invoices and investments from localStorage
  useEffect(() => {
    const storedInvoices = localStorage.getItem(DB_KEYS.INVOICES);
    const storedInvestments = localStorage.getItem(DB_KEYS.INVESTMENTS);
    
    let parsedInvoices: Invoice[] = [];
    let parsedInvestments: Investment[] = [];
    
    if (storedInvoices) {
      parsedInvoices = JSON.parse(storedInvoices);
    }
    
    if (storedInvestments) {
      parsedInvestments = JSON.parse(storedInvestments);
    }
    
    setInvestments(parsedInvestments);
    
    // Filter based on user role and requirements
    let filtered = parsedInvoices;
    
    if (userRole === "sme" && userId) {
      if (portfolioOnly) {
        // For SMEs, show only invoices that have investments
        const investedInvoiceIds = parsedInvestments
          .filter(inv => parsedInvoices.some(i => i.userId === userId && i.id === inv.invoice_id))
          .map(inv => inv.invoice_id);
          
        filtered = parsedInvoices.filter(inv => 
          inv.userId === userId && investedInvoiceIds.includes(inv.id)
        );
      } else {
        // Show all invoices created by this SME
        filtered = parsedInvoices.filter(inv => inv.userId === userId);
      }
    } else if (userRole === "investor") {
      if (portfolioOnly && userId) {
        // Show only invoices the investor has invested in
        const investedInvoiceIds = parsedInvestments
          .filter(inv => inv.investor_id === userId)
          .map(inv => inv.invoice_id);
          
        filtered = parsedInvoices.filter(inv => 
          investedInvoiceIds.includes(inv.id)
        );
      } else {
        // Show available invoices for investment
        filtered = parsedInvoices.filter(inv => inv.status === "Available");
      }
    }
    
    setInvoices(filtered);
    setFilteredInvoices(filtered);
  }, [userRole, username, userId, portfolioOnly]);

  // Apply filters whenever search term or filters change
  useEffect(() => {
    let result = [...invoices];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        invoice => 
          (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (invoice.description && invoice.description.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleViewDetails = (invoice: Invoice) => {
    // Show investment details if it's an investor viewing their portfolio
    if (userRole === "investor" && portfolioOnly && userId) {
      const investment = investments.find(
        inv => inv.invoice_id === invoice.id && inv.investor_id === userId
      );
      
      if (investment) {
        toast.info(`Investment of ${formatCurrency(investment.amount)} made on ${format(new Date(investment.created_at), 'MMM dd, yyyy')}`);
      }
    } else {
      toast.info(`Viewing invoice: ${invoice.invoiceNumber}`);
    }
  };

  const handleInvest = (invoice: Invoice) => {
    if (!userId) {
      toast.error("Please log in to invest");
      return;
    }
    
    // Create new investment
    const newInvestment: Investment = {
      id: crypto.randomUUID(),
      invoice_id: invoice.id,
      investor_id: userId,
      amount: invoice.amount,
      status: 'Confirmed',
      transaction_hash: "0x" + Math.random().toString(36).substring(2, 15),
      return_amount: (parseFloat(invoice.amount) * 1.1).toFixed(2), // 10% return
      return_date: new Date(
        new Date().getTime() + parseInt(invoice.duration) * 24 * 60 * 60 * 1000
      ).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Update the invoice's status
    const updatedInvoices = JSON.parse(localStorage.getItem(DB_KEYS.INVOICES) || "[]").map((inv: Invoice) => {
      if (inv.id === invoice.id) {
        return {
          ...inv,
          status: "Funded",
          investor_id: userId
        };
      }
      return inv;
    });
    
    // Get existing investments
    const existingInvestments = JSON.parse(localStorage.getItem(DB_KEYS.INVESTMENTS) || "[]");
    
    // Add new investment
    existingInvestments.push(newInvestment);
    
    // Save to localStorage
    localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify(updatedInvoices));
    localStorage.setItem(DB_KEYS.INVESTMENTS, JSON.stringify(existingInvestments));
    
    // Refresh invoice list
    setInvoices(updatedInvoices.filter((inv: Invoice) => 
      userRole === "sme" ? inv.userId === userId : inv.status === "Available"
    ));
    
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
                    <h3 className="font-medium text-white">Invoice #{invoice.invoiceNumber}</h3>
                    <Badge className={
                      invoice.status === "Available" ? "bg-green-500/70" :
                      invoice.status === "Funded" ? "bg-blue-500/70" :
                      "bg-purple-500/70"
                    }>
                      {invoice.status}
                    </Badge>
                  </div>
                  {invoice.description && (
                    <p className="text-sm text-gray-400 line-clamp-1">{invoice.description}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Due date: {formatDate(invoice.dueDate)}
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
                      <Eye className="h-3 w-3 mr-1" />
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
