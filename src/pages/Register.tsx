
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User } from "@/types/database";
import FloatingElements from "@/components/FloatingElements";
import { LogIn, UserPlus } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"SME" | "Investor">("SME");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would send data to your backend
      // For now, we'll simulate storing in localStorage

      const timestamp = new Date().toISOString();
      const newUser: User = {
        id: crypto.randomUUID(),
        username,
        email,
        password_hash: password, // In a real app, we'd hash this server-side
        full_name: fullName,
        eth_address: ethAddress,
        account_type: accountType,
        profile_image: null,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user with same email or username already exists
      const emailExists = existingUsers.some((user: User) => user.email === email);
      const usernameExists = existingUsers.some((user: User) => user.username === username);
      
      if (emailExists) {
        toast.error("Email already in use");
        setIsLoading(false);
        return;
      }
      
      if (usernameExists) {
        toast.error("Username already taken");
        setIsLoading(false);
        return;
      }
      
      // Add new user to array and save back to localStorage
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      
      toast.success("Account created successfully!");
      navigate("/login");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fundora-dark text-white overflow-hidden">
      <FloatingElements />
      
      <div className="container mx-auto px-4 py-20 flex justify-center items-center relative z-10">
        <Card className="w-full max-w-md glass-morphism border border-fundora-blue/30">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-gradient">Create Account</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your details to register a new account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Account Type</Label>
                <Tabs 
                  defaultValue="SME" 
                  className="w-full" 
                  value={accountType} 
                  onValueChange={(value) => setAccountType(value as "SME" | "Investor")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="SME">SME</TabsTrigger>
                    <TabsTrigger value="Investor">Investor</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="username"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  placeholder="John Doe"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ethAddress" className="text-white">Ethereum Address</Label>
                <Input 
                  id="ethAddress" 
                  type="text" 
                  placeholder="0x..."
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={ethAddress}
                  onChange={(e) => setEthAddress(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-fundora-blue to-fundora-cyan"
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Already have an account? 
                <Button 
                  variant="link" 
                  className="text-fundora-blue pl-1"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-1 h-4 w-4" /> 
                  Login
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
