
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, DollarSign, Calendar, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DB_KEYS, Investment, Invoice, User } from "@/types/database";
import { format } from "date-fns";

interface InvestmentsListProps {
  userId: string;
  userRole: "sme" | "investor";
}

const InvestmentsList = ({ userId, userRole }: InvestmentsListProps) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Load investments, invoices and users
    const storedInvestments = localStorage.getItem(DB_KEYS.INVESTMENTS);
    const storedInvoices = localStorage.getItem(DB_KEYS.INVOICES);
    const storedUsers = localStorage.getItem(DB_KEYS.USERS);
    
    let parsedInvestments: Investment[] = [];
    let parsedInvoices: Invoice[] = [];
    let parsedUsers: User[] = [];
    
    if (storedInvestments) parsedInvestments = JSON.parse(storedInvestments);
    if (storedInvoices) parsedInvoices = JSON.parse(storedInvoices);
    if (storedUsers) parsedUsers = JSON.parse(storedUsers);
    
    // Set the full data
    setInvoices(parsedInvoices);
    setUsers(parsedUsers);
    
    // Filter investments based on user role
    let relevantInvestments: Investment[] = [];
    
    if (userRole === "investor") {
      // For investors, show investments they've made
      relevantInvestments = parsedInvestments.filter(inv => inv.investor_id === userId);
    } else {
      // For SMEs, show investments in their invoices
      const smeInvoiceIds = parsedInvoices
        .filter(invoice => invoice.userId === userId)
        .map(invoice => invoice.id);
      
      relevantInvestments = parsedInvestments.filter(inv => 
        smeInvoiceIds.includes(inv.invoice_id)
      );
    }
    
    // Add invoice and investor details to investments
    const enrichedInvestments = relevantInvestments.map(investment => {
      const invoice = parsedInvoices.find(inv => inv.id === investment.invoice_id);
      const investor = parsedUsers.find(user => user.id === investment.investor_id);
      
      return {
        ...investment,
        invoice,
        investor
      };
    });
    
    setInvestments(enrichedInvestments);
    setFilteredInvestments(enrichedInvestments);
  }, [userId, userRole]);

  // Apply filters whenever search term or status filter changes
  useEffect(() => {
    let result = [...investments];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(investment => 
        investment.invoice?.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.investor?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.transaction_hash.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(investment => 
        investment.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredInvestments(result);
  }, [searchTerm, statusFilter, investments]);

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-fundora-cyan">
          {userRole === "investor" ? "My Investments" : "Investments in My Invoices"}
        </h2>
        <p className="text-gray-300 text-sm">
          {userRole === "investor" 
            ? "Track the performance of your investments" 
            : "See who has invested in your invoices"}
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search investments..." 
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Investments Table */}
      {filteredInvestments.length === 0 ? (
        <div className="text-center py-10">
          <DollarSign className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-orbitron text-gradient mb-2">No Investments Found</h3>
          <p className="text-gray-300 max-w-md mx-auto">
            {investments.length === 0
              ? (userRole === "investor" 
                  ? "You haven't made any investments yet."
                  : "No one has invested in your invoices yet.")
              : "No investments match your current filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="border border-fundora-blue/30 rounded-md">
            <TableHeader className="bg-white/5">
              <TableRow>
                <TableHead className="text-fundora-cyan">Invoice</TableHead>
                {userRole === "sme" && <TableHead className="text-fundora-cyan">Investor</TableHead>}
                <TableHead className="text-fundora-cyan">Amount</TableHead>
                <TableHead className="text-fundora-cyan">Return</TableHead>
                <TableHead className="text-fundora-cyan">Status</TableHead>
                <TableHead className="text-fundora-cyan">Date</TableHead>
                <TableHead className="text-fundora-cyan">Due Date</TableHead>
                <TableHead className="text-right text-fundora-cyan">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestments.map((investment) => (
                <TableRow key={investment.id} className="border-t border-fundora-blue/20">
                  <TableCell className="font-medium text-white">
                    #{investment.invoice?.invoiceNumber || 'N/A'}
                  </TableCell>
                  {userRole === "sme" && (
                    <TableCell className="text-white">
                      {investment.investor?.username || 'Anonymous'}
                    </TableCell>
                  )}
                  <TableCell className="text-white">
                    {formatCurrency(investment.amount)}
                  </TableCell>
                  <TableCell className="text-white">
                    {formatCurrency(investment.return_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      investment.status === "Pending" ? "bg-yellow-500/70" :
                      investment.status === "Confirmed" ? "bg-blue-500/70" :
                      investment.status === "Completed" ? "bg-green-500/70" :
                      "bg-red-500/70" // Refunded
                    }>
                      {investment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(investment.created_at)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(investment.return_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs glass-morphism"
                      onClick={() => {
                        toast.info(`Transaction hash: ${investment.transaction_hash}`);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default InvestmentsList;
