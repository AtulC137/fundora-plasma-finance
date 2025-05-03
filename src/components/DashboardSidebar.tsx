
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, FileText, User, LogOut, Menu, X, MessageCircle } from "lucide-react";

interface UserType {
  email: string;
  username?: string;
  name?: string;
  profileImage?: string;
  isLoggedIn: boolean;
  [key: string]: any;
}

interface DashboardSidebarProps {
  user: UserType;
  onToggleChat: () => void;
}

const DashboardSidebar = ({ user, onToggleChat }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get first letter of username or email for avatar fallback
  const getInitials = () => {
    if (user.username) return user.username.charAt(0).toUpperCase();
    if (user.name) return user.name.charAt(0).toUpperCase();
    return user.email.charAt(0).toUpperCase();
  };

  // Get display name (username, name, or email)
  const getDisplayName = () => {
    if (user.username) return user.username;
    if (user.name) return user.name;
    return user.email;
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      action: () => navigate("/")
    },
    {
      icon: Home,
      label: "Dashboard",
      action: () => navigate("/dashboard")
    },
    {
      icon: User,
      label: "Profile",
      action: () => navigate("/profile")
    },
    {
      icon: FileText,
      label: "My Invoices",
      action: () => navigate("/invoice")
    },
    {
      icon: MessageCircle,
      label: "Messages",
      action: onToggleChat
    },
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout
    }
  ];

  const sidebarContent = (
    <>
      <div className="flex flex-col items-center py-8">
        <Avatar className="h-20 w-20 border-2 border-fundora-blue">
          {user.profileImage ? (
            <AvatarImage src={user.profileImage} alt={getDisplayName()} />
          ) : (
            <AvatarFallback className="text-2xl bg-fundora-blue/30">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-white">{getDisplayName()}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-fundora-blue/30 text-fundora-cyan">
              {user.accountType || "User"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-6">
        <nav>
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-white hover:bg-fundora-blue/20"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass-morphism rounded-md text-white"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 glass-morphism border-r border-fundora-blue/30">
        {sidebarContent}
      </div>
      
      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMobileMenu}></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 glass-morphism border-r border-fundora-blue/30 transform transition-transform duration-200 ease-in-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
