
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import FloatingElements from "@/components/FloatingElements";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Check if user is logged in
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      setName(parsedUser.name || "");
      setEmail(parsedUser.email || "");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSaveProfile = () => {
    if (!user) return;

    // Update user information in localStorage
    const updatedUser = {
      ...user,
      name: name,
      email: email
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast.success("Profile updated successfully!");
  };

  // If not logged in, don't render anything
  if (!user) {
    return null;
  }

  // Get first letter of email for avatar fallback
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="h-screen flex bg-fundora-dark">
      {/* Dashboard Sidebar */}
      <DashboardSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        <FloatingElements />
        
        <div className="relative z-10 p-6 md:p-10 h-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-orbitron text-gradient">
              Your Profile
            </h1>
            <p className="text-gray-300 mt-2">
              View and update your personal information
            </p>
          </header>
          
          <main className="max-w-3xl">
            <Card className="glass-morphism border border-fundora-blue/30">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 border-2 border-fundora-blue">
                      <AvatarImage src="/lovable-uploads/b5231bad-d3df-4157-b60f-9669e21ae764.png" alt={email} />
                      <AvatarFallback className="text-4xl bg-fundora-blue/30">
                        <User className="h-16 w-16" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <p className="text-white mt-4 text-center">
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-fundora-blue/30 text-fundora-cyan">
                        {user.accountType || "User"}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="bg-white/10 border-fundora-blue/30 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input 
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        className="bg-white/10 border-fundora-blue/30 text-white"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-fundora-blue to-fundora-cyan"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
