
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileUp, Calendar, Upload, DollarSign, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This would normally be in a separate store/context
let globalInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");

const SMEForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    ethName: "",
    realName: "",
    sender: "",
    receiver: "",
    duration: "30",
    amount: "",
    description: "",
    file: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  // Get user data if available
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Set ethName and realName from user data if available
  useState(() => {
    if (user) {
      setFormData(prev => ({ 
        ...prev, 
        ethName: user.username || "",
        realName: user.fullName || ""
      }));
    }
  });
  
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
      
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      
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
        setPreviewUrl("/placeholder.svg"); // Use a PDF icon or placeholder
      } else {
        setPreviewUrl("");
      }
    }
  };

  const nextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.ethName || !formData.realName) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.amount || !formData.duration) {
        toast.error("Please enter amount and select duration");
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.ethName || !formData.realName || !formData.amount || !formData.file) {
      toast.error("Please fill all required fields and upload an invoice");
      setIsSubmitting(false);
      return;
    }

    // Create new invoice object
    const newInvoice = {
      id: Date.now().toString(),
      ...formData,
      fileName: formData.file?.name || "No file uploaded",
      fileType: formData.file?.type || "",
      status: "Available",
      createdAt: new Date().toISOString(),
      previewUrl: previewUrl,
    };

    // In a real application, we would send this to an API
    // For now, we'll store it in localStorage
    setTimeout(() => {
      // Add to our global state
      globalInvoices.push(newInvoice);
      
      // Save to localStorage
      localStorage.setItem("invoices", JSON.stringify(globalInvoices));
      
      toast.success("Invoice minted successfully!");
      
      // Reset form
      setFormData({
        title: "",
        ethName: user?.username || "",
        realName: user?.fullName || "",
        sender: "",
        receiver: "",
        duration: "30",
        amount: "",
        description: "",
        file: null,
      });
      setPreviewUrl("");
      setIsSubmitting(false);
      setCurrentStep(1);
    }, 1000);
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ethName" className="text-white">Base.eth Username*</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="ethName"
                  name="ethName"
                  placeholder="yourname.base.eth"
                  className="bg-white/10 border-fundora-blue/30 text-white pl-10"
                  value={formData.ethName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="realName" className="text-white">Full Name*</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="realName"
                  name="realName"
                  placeholder="John Doe"
                  className="bg-white/10 border-fundora-blue/30 text-white pl-10"
                  value={formData.realName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Invoice Title*</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter invoice title"
                className="bg-white/10 border-fundora-blue/30 text-white"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender" className="text-white">From (Sender)*</Label>
                <Input
                  id="sender"
                  name="sender"
                  placeholder="Your company name"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={formData.sender}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver" className="text-white">To (Receiver)*</Label>
                <Input
                  id="receiver"
                  name="receiver"
                  placeholder="Client company name"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={formData.receiver}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
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
              <Label htmlFor="description" className="text-white">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter additional details about this invoice"
                className="bg-white/10 border-fundora-blue/30 text-white min-h-[100px]"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file" className="text-white">Upload Invoice Document* (PDF or Image)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white/5 border-fundora-blue/30 hover:bg-white/10"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-fundora-cyan" />
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PDF, PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    name="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-300 mb-1">Preview:</p>
                  <img src={previewUrl} alt="Preview" className="max-h-40 rounded border border-fundora-blue/30" />
                </div>
              )}
              {formData.file && !previewUrl && (
                <p className="text-sm text-gray-300">File selected: {formData.file.name}</p>
              )}
            </div>
            
            <div className="mt-6 space-y-2 bg-fundora-blue/10 p-4 rounded-md">
              <h3 className="font-medium text-fundora-cyan">Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-400">Base.eth Name:</span>
                <span className="text-white">{formData.ethName}</span>
                
                <span className="text-gray-400">Full Name:</span>
                <span className="text-white">{formData.realName}</span>
                
                <span className="text-gray-400">Amount:</span>
                <span className="text-white">${formData.amount}</span>
                
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{formData.duration} days</span>
                
                <span className="text-gray-400">File:</span>
                <span className="text-white truncate">{formData.file?.name || "Not uploaded"}</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Progress indicator
  const renderProgress = () => {
    return (
      <div className="flex mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-1 items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === step 
                ? "bg-fundora-blue text-white" 
                : currentStep > step 
                  ? "bg-green-500 text-white" 
                  : "bg-white/10 text-gray-400"
            }`}>
              {currentStep > step ? "✓" : step}
            </div>
            <div className={`flex-1 h-1 ${
              step < 3 ? (currentStep > step ? "bg-green-500" : "bg-white/10") : "hidden"
            }`} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="glass-morphism border border-fundora-blue/30">
      <CardHeader>
        <CardTitle className="text-xl font-orbitron text-gradient text-center">Mint New Invoice</CardTitle>
        <CardDescription className="text-center text-gray-300">
          Create a new invoice for investors to fund
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderProgress()}
          {renderStepContent()}
          
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                className="glass-morphism"
              >
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < 3 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="bg-gradient-to-r from-fundora-blue to-fundora-cyan"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit"
                className="bg-gradient-to-r from-fundora-blue to-fundora-cyan"
                disabled={isSubmitting}
              >
                <FileUp className="mr-2 h-4 w-4" />
                {isSubmitting ? "Minting Invoice..." : "Mint Invoice"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SMEForm;
