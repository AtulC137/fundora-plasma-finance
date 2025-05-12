
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InvestmentFormProps {
  invoice: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  user: any;
}

const InvestmentForm = ({ invoice, onSuccess, onCancel, user }: InvestmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(parseFloat(invoice.amount) / 2); // Default to half the invoice amount
  const maxAmount = parseFloat(invoice.amount);
  const [sliderValue, setSliderValue] = useState([50]); // Percentage for slider

  // Calculate expected return (simplified - in a real app this would use more complex logic)
  const calculateReturn = (investmentAmount: number) => {
    // Simple 10% return for demo purposes
    return investmentAmount * 1.1;
  };
  
  // Calculate return date based on duration
  const calculateReturnDate = () => {
    const duration = parseInt(invoice.duration);
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + duration);
    return returnDate.toLocaleDateString();
  };

  // Update amount when slider changes
  const handleSliderChange = (value: number[]) => {
    const percentage = value[0];
    setSliderValue([percentage]);
    const newAmount = (maxAmount * percentage) / 100;
    setAmount(Number(newAmount.toFixed(2)));
  };

  // Update slider when amount changes directly
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newAmount = parseFloat(e.target.value);
    
    if (isNaN(newAmount)) {
      newAmount = 0;
    }
    
    // Cap at the invoice amount
    if (newAmount > maxAmount) {
      newAmount = maxAmount;
    }
    
    setAmount(newAmount);
    
    // Update slider
    const percentage = Math.round((newAmount / maxAmount) * 100);
    setSliderValue([percentage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate input
      if (!amount || amount <= 0 || amount > maxAmount) {
        toast.error("Please enter a valid investment amount");
        setIsSubmitting(false);
        return;
      }
      
      // In a real app, this would connect to a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      
      // Mock transaction hash
      const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64);
      
      // Create timestamp for transactions
      const timestamp = new Date().toISOString();
      
      // Calculate return date
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + parseInt(invoice.duration));
      
      // Create investment record
      const newInvestment = {
        id: crypto.randomUUID(),
        invoice_id: invoice.id,
        investor_id: user.id,
        amount: amount.toString(),
        status: "Confirmed",
        transaction_hash: mockTxHash,
        return_amount: calculateReturn(amount).toFixed(2),
        return_date: returnDate.toISOString(),
        created_at: timestamp,
        updated_at: timestamp
      };
      
      // Save investment to localStorage
      const investments = JSON.parse(localStorage.getItem("investments") || "[]");
      investments.push(newInvestment);
      localStorage.setItem("investments", JSON.stringify(investments));
      
      // Create transaction record
      const newTransaction = {
        id: crypto.randomUUID(),
        user_id: user.id,
        investment_id: newInvestment.id,
        invoice_id: invoice.id,
        type: "Investment",
        amount: amount.toString(),
        status: "Completed",
        transaction_hash: mockTxHash,
        transaction_chain_url: `https://etherscan.io/tx/${mockTxHash}`,
        created_at: timestamp
      };
      
      // Save transaction to localStorage
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      transactions.push(newTransaction);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      
      // Update invoice status if fully funded
      const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
      const invoiceIndex = invoices.findIndex((inv: any) => inv.id === invoice.id);
      
      if (invoiceIndex !== -1) {
        if (amount >= parseFloat(invoice.amount)) {
          invoices[invoiceIndex].status = "Funded";
        }
        invoices[invoiceIndex].updated_at = timestamp;
      }
      
      localStorage.setItem("invoices", JSON.stringify(invoices));
      
      toast.success("Investment successful!");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Investment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-morphism border border-fundora-blue/30">
      <CardHeader>
        <CardTitle className="text-xl text-fundora-cyan">Invest in Invoice</CardTitle>
        <CardDescription className="text-gray-300">
          Invoice #{invoice.invoiceNumber} | ${parseFloat(invoice.amount).toLocaleString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">Investment Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min={0}
                max={maxAmount}
                step={0.01}
                className="bg-white/10 border-fundora-blue/30 text-white pl-10"
              />
            </div>
            
            <div className="pt-4">
              <Slider 
                value={sliderValue} 
                min={0} 
                max={100} 
                step={1} 
                onValueChange={handleSliderChange}
                className="bg-fundora-blue/30"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded bg-fundora-blue/10 space-y-3">
            <h4 className="text-sm font-medium text-fundora-cyan">Investment Summary</h4>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-400">Invoice Amount:</span>
              <span className="text-white text-right">${parseFloat(invoice.amount).toLocaleString()}</span>
              
              <span className="text-gray-400">Your Investment:</span>
              <span className="text-white text-right">${amount.toLocaleString()}</span>
              
              <span className="text-gray-400">Expected Return:</span>
              <span className="text-fundora-cyan text-right font-medium">
                ${calculateReturn(amount).toLocaleString()}
              </span>
              
              <span className="text-gray-400">Return Date:</span>
              <span className="text-white text-right">{calculateReturnDate()}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-fundora-blue to-fundora-cyan"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" /> Invest Now
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;
