
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";
import FloatingElements from "@/components/FloatingElements";
import WalletConnect from "@/components/WalletConnect";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState("sme"); // Default role
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a mock login - in a real app, this would authenticate with a backend
    setTimeout(() => {
      if (email && password) {
        // Store user data in localStorage for this demo
        localStorage.setItem("user", JSON.stringify({ 
          email, 
          username: username || email.split('@')[0],
          isLoggedIn: true,
          role: userRole // Store the selected role
        }));
        
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        toast.error("Please enter your email and password");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Handler for successful account creation
  const handleAccountCreated = (newUsername: string) => {
    setUsername(newUsername);
    setEmail(newUsername);
    setDialogOpen(false);
    toast.success(`Account created as ${userRole === "sme" ? "an SME" : "an Investor"}! You can now log in.`);
  };

  return (
    <div className="min-h-screen bg-fundora-dark text-white overflow-hidden">
      <FloatingElements />
      
      <div className="container mx-auto px-4 py-20 flex justify-center items-center relative z-10">
        <Card className="w-full max-w-md glass-morphism border border-fundora-blue/30">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-gradient">Login to Fundora</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">I am a:</Label>
                <Tabs 
                  defaultValue="sme" 
                  className="w-full" 
                  value={userRole} 
                  onValueChange={setUserRole}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sme">SME</TabsTrigger>
                    <TabsTrigger value="investor">Investor</TabsTrigger>
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-fundora-blue to-fundora-cyan"
                disabled={isLoading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                New user? 
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="link" 
                      className="text-fundora-blue pl-1"
                    >
                      <UserPlus className="mr-1 h-4 w-4" /> 
                      Sign up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-morphism border border-fundora-blue/30 max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-orbitron text-gradient">
                        Create {userRole === "sme" ? "SME" : "Investor"} Account
                      </DialogTitle>
                      <DialogDescription className="text-center text-gray-300">
                        Connect your wallet to create your {userRole === "sme" ? "Business" : "Investor"} account
                      </DialogDescription>
                    </DialogHeader>
                    <WalletConnect 
                      onAccountCreated={handleAccountCreated} 
                      userRole={userRole}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
