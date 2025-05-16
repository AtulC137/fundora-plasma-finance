
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";
import FloatingElements from "@/components/FloatingElements";
import { User } from "@/types/database";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Email or username
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isLoggedIn) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, this would authenticate with a backend
    setTimeout(() => {
      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if the email/username and password match
      const matchedUser = users.find((user: User) => 
        (user.email === identifier || user.username === identifier) && 
        user.password_hash === password
      );
      
      if (matchedUser) {
        // Update user object with isLoggedIn flag
        matchedUser.isLoggedIn = true;
        
        // Save updated user data
        localStorage.setItem("user", JSON.stringify(matchedUser));
        
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid email/username or password");
      }
      setIsLoading(false);
    }, 1000);
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
                <Label htmlFor="identifier" className="text-white">Email or Username</Label>
                <Input 
                  id="identifier" 
                  type="text" 
                  placeholder="email or username"
                  className="bg-white/10 border-fundora-blue/30 text-white"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                <Button 
                  variant="link" 
                  className="text-fundora-blue pl-1"
                  onClick={() => navigate("/register")}
                >
                  <UserPlus className="mr-1 h-4 w-4" /> 
                  Create Account
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
