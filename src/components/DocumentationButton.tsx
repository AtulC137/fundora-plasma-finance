
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentationButtonProps {
  className?: string;
  variant?: "default" | "subtle";
}

const DocumentationButton = ({ 
  className,
  variant = "default" 
}: DocumentationButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/documentation")}
      className={cn(
        "group transition-all duration-300",
        variant === "default" 
          ? "bg-gradient-to-r from-fundora-blue to-fundora-cyan text-white hover:shadow-lg hover:shadow-fundora-blue/20" 
          : "glass-morphism hover:bg-white/10",
        className
      )}
    >
      <FileText className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
      Documentation
    </Button>
  );
};

export default DocumentationButton;
