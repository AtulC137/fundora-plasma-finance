
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/DashboardSidebar";
import ChatSidebar from "@/components/ChatSidebar";
import FloatingElements from "@/components/FloatingElements";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Upload, Wallet } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("sme");
  const [walletType, setWalletType] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Toggle chat sidebar function
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  // Check if user is logged in
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      setName(parsedUser.fullName || parsedUser.name || "");
      setEmail(parsedUser.email || "");
      setUsername(parsedUser.username || "");
      setUserRole(parsedUser.role || "sme");
      setWalletType(parsedUser.walletType || "");
      setProfileImage(parsedUser.profileImage || null);
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
      fullName: name,
      email: email,
      username: username,
      role: userRole,
      profileImage: profileImage,
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast.success("Profile updated successfully!");
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // If not logged in, don't render anything
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-fundora-dark">
      {/* Dashboard Sidebar */}
      <DashboardSidebar user={user} onToggleChat={toggleChat} />
      
      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={toggleChat} user={user} />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-auto relative transition-all ${isChatOpen ? 'md:mr-80' : ''}`}>
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
            <Card className="glass-morphism border border-fundora-blue/30 mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <Avatar className="h-32 w-32 border-2 border-fundora-blue">
                        {profileImage ? (
                          <AvatarImage src={profileImage} alt={username || email} />
                        ) : (
                          <AvatarFallback className="text-4xl bg-fundora-blue/30">
                            <User className="h-16 w-16" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                        onClick={triggerFileUpload}
                      >
                        <Upload className="h-8 w-8 text-white" />
                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center space-y-2">
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-fundora-blue/30 text-fundora-cyan">
                        {userRole === "investor" ? "Investor" : "SME"}
                      </span>
                      {walletType && (
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-300">
                          <Wallet className="h-3 w-3" />
                          <span>{walletType} connected</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Username (.base.eth)</Label>
                      <Input 
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="yourname.base.eth"
                        className="bg-white/10 border-fundora-blue/30 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name</Label>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-morphism border border-fundora-blue/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Account Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Type:</span>
                      <span className="text-white font-medium">{userRole === "investor" ? "Investor" : "SME"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Member Since:</span>
                      <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet Connected:</span>
                      <span className="text-white font-medium">{walletType || "None"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism border border-fundora-blue/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    {userRole === "investor" ? "Investment Stats" : "Invoice Stats"}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {userRole === "investor" ? "Total Investments:" : "Total Invoices:"}
                      </span>
                      <span className="text-white font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {userRole === "investor" ? "Active Investments:" : "Active Invoices:"}
                      </span>
                      <span className="text-white font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        {userRole === "investor" ? "Completed Investments:" : "Completed Invoices:"}
                      </span>
                      <span className="text-white font-medium">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
