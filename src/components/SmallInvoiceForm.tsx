
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, DollarSign, Calendar, Upload } from "lucide-react";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Invoice, User, DB_KEYS } from "@/types/database";

interface SmallInvoiceFormProps {
  user: User;
}

const SmallInvoiceForm = ({ user }: SmallInvoiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    amount: "",
    duration: "30",
    description: "",
    file: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, file }));
      
      // Create preview for image files
      if (file.type.includes("image")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPreviewUrl(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setPreviewUrl("/placeholder.svg"); // Use a placeholder for PDF
      } else {
        setPreviewUrl("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.invoiceNumber || !formData.amount || !formData.duration) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    // Calculate due date based on duration
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(formData.duration));

    // Create timestamp for created_at and updated_at
    const timestamp = new Date().toISOString();

    // In a real app, we would upload the file to IPFS
    // Here we'll simulate with a mock IPFS hash
    const mockIpfsHash = "ipfs://" + Math.random().toString(36).substring(2, 15);

    // Create new invoice object
    const newInvoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: formData.invoiceNumber,
      amount: formData.amount,
      duration: formData.duration,
      dueDate: dueDate.toISOString(),
      uploadedFile: mockIpfsHash,
      description: formData.description,
      status: "Available",
      created_at: timestamp,
      updated_at: timestamp,
      userId: user.id, // Link to user
      fileName: formData.file?.name || "No file uploaded",
      previewUrl: previewUrl,
    };

    // Get existing invoices
    const existingInvoices = JSON.parse(localStorage.getItem(DB_KEYS.INVOICES) || "[]");
    
    // Add new invoice
    existingInvoices.push(newInvoice);
    
    // Save to localStorage
    localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify(existingInvoices));
    
    toast.success("Invoice created successfully!");
    
    // Reset form
    setFormData({
      invoiceNumber: "",
      amount: "",
      duration: "30",
      description: "",
      file: null,
    });
    setPreviewUrl("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber" className="text-white">Invoice Number*</Label>
          <Input
            id="invoiceNumber"
            name="invoiceNumber"
            placeholder="INV-001"
            className="bg-white/10 border-fundora-blue/30 text-white"
            value={formData.invoiceNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-white">Amount (USD)*</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              className="bg-white/10 border-fundora-blue/30 text-white pl-10"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration" className="text-white">Duration*</Label>
        <Select 
          value={formData.duration} 
          onValueChange={(value) => handleSelectChange('duration', value)}
        >
          <SelectTrigger id="duration" className="bg-white/10 border-fundora-blue/30 text-white">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="14">14 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="60">60 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="file" className="text-white">Upload Invoice (Optional)</Label>
        <div className="relative">
          <Input
            id="file"
            type="file"
            className="bg-white/10 border-fundora-blue/30 text-white cursor-pointer"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
        {previewUrl && (
          <div className="mt-2">
            <p className="text-xs text-gray-400">File preview:</p>
            <img src={previewUrl} alt="Preview" className="max-h-20 rounded" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter additional details"
          className="bg-white/10 border-fundora-blue/30 text-white min-h-[80px]"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-fundora-blue to-fundora-cyan"
        disabled={isSubmitting}
      >
        <FileUp className="mr-2 h-4 w-4" />
        {isSubmitting ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  );
};

export default SmallInvoiceForm;
