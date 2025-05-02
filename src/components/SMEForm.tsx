import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileUp, Calendar, Upload, DollarSign } from "lucide-react";

// This would normally be in a separate store/context
let globalInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");

const SMEForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    sender: "",
    receiver: "",
    startDate: "",
    endDate: "",
    amount: "",
    description: "",
    file: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
          setPreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.title || !formData.sender || !formData.receiver || !formData.amount) {
      toast.error("Please fill all required fields");
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
        sender: "",
        receiver: "",
        startDate: "",
        endDate: "",
        amount: "",
        description: "",
        file: null,
      });
      setPreviewUrl("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-orbitron text-gradient">Mint New Invoice</h2>
        <p className="text-gray-300">Create a new invoice for investors to fund</p>
      </div>

      <div className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file" className="text-white">Upload Invoice Document (PDF or Image)</Label>
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

        {/* Invoice Title */}
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

        {/* From and To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sender" className="text-white">From (Sender)*</Label>
            <Input
              id="sender"
              name="sender"
              placeholder="Sender company name"
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
              placeholder="Receiver company name"
              className="bg-white/10 border-fundora-blue/30 text-white"
              value={formData.receiver}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-white">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="startDate"
                name="startDate"
                type="date"
                className="bg-white/10 border-fundora-blue/30 text-white pl-10"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-white">End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="endDate"
                name="endDate"
                type="date"
                className="bg-white/10 border-fundora-blue/30 text-white pl-10"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Amount */}
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

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Description or Notes</Label>
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

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-fundora-blue to-fundora-cyan"
        disabled={isSubmitting}
      >
        <FileUp className="mr-2 h-4 w-4" />
        {isSubmitting ? "Minting Invoice..." : "Mint Invoice"}
      </Button>
    </form>
  );
};

export default SMEForm;
