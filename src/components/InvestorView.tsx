
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  User, 
  Building
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  title: string;
  sender: string;
  receiver: string;
  startDate: string;
  endDate: string;
  amount: string;
  description: string;
  status: string;
  fileName: string;
  fileType: string;
  createdAt: string;
  previewUrl?: string;
}

const InvestorView = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Load invoices from localStorage
    const storedInvoices = localStorage.getItem("invoices");
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices));
    }
  }, []);

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500 text-green-50";
      case "funded":
        return "bg-blue-500 text-blue-50";
      case "completed":
        return "bg-purple-500 text-purple-50";
      default:
        return "bg-gray-500 text-gray-50";
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return "Invalid date";
    }
  };

  // If there are no invoices, show a message
  if (invoices.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-orbitron text-gradient mb-2">No Invoices Available</h3>
        <p className="text-gray-300 max-w-md mx-auto">
          There are currently no invoices available for investment. Please check back later or switch to SME mode to mint new invoices.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-orbitron text-gradient">Available Invoices</h2>
        <p className="text-gray-300">Browse and invest in available invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <Card 
            key={invoice.id} 
            className="bg-white/5 border border-fundora-blue/30 hover:border-fundora-blue transition-all"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-lg">{invoice.title}</CardTitle>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
              <CardDescription className="text-gray-400 flex items-center">
                <User className="h-3 w-3 mr-1" /> {invoice.sender}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <Building className="h-4 w-4 mr-2 text-fundora-cyan" />
                  <span>To: {invoice.receiver}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <DollarSign className="h-4 w-4 mr-2 text-fundora-cyan" />
                  <span className="font-semibold text-white">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>
                
                {(invoice.startDate || invoice.endDate) && (
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 text-fundora-cyan" />
                    <span>
                      {formatDate(invoice.startDate)} 
                      {invoice.endDate && ` - ${formatDate(invoice.endDate)}`}
                    </span>
                  </div>
                )}
                
                {invoice.description && (
                  <p className="text-gray-300 line-clamp-2">{invoice.description}</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2">
              <Button 
                onClick={() => handleViewDetails(invoice)}
                variant="outline"
                className="w-full glass-morphism"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-morphism border border-fundora-blue/30 max-w-3xl">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-orbitron text-gradient">
                  {selectedInvoice.title}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  Invoice from {selectedInvoice.sender} to {selectedInvoice.receiver}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Invoice Amount</h4>
                    <p className="text-2xl font-semibold text-white">
                      {formatCurrency(selectedInvoice.amount)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Start Date</h4>
                      <p className="text-white">
                        {formatDate(selectedInvoice.startDate) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">End Date</h4>
                      <p className="text-white">
                        {formatDate(selectedInvoice.endDate) || "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Status</h4>
                    <Badge className={getStatusColor(selectedInvoice.status)}>
                      {selectedInvoice.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                    <p className="text-gray-300">
                      {selectedInvoice.description || "No description provided"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Document</h4>
                    <p className="text-gray-300 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-fundora-cyan" />
                      {selectedInvoice.fileName}
                    </p>
                  </div>
                </div>
                
                <div>
                  {selectedInvoice.previewUrl ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Document Preview</h4>
                      <img 
                        src={selectedInvoice.previewUrl} 
                        alt="Invoice preview" 
                        className="w-full h-auto rounded border border-fundora-blue/30"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-white/5 rounded border border-fundora-blue/30 p-6">
                      <div className="text-center">
                        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-300">No preview available</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {selectedInvoice.fileName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  className="bg-gradient-to-r from-fundora-blue to-fundora-cyan"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Invest in This Invoice
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorView;
