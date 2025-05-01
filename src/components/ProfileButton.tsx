
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "lucide-react";

interface ProfileButtonProps {
  username?: string;
}

const ProfileButton = ({ username }: ProfileButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="rounded-full p-0 h-10 w-10 glass-morphism">
          <Avatar className="h-9 w-9">
            <AvatarImage 
              src="/lovable-uploads/b5231bad-d3df-4157-b60f-9669e21ae764.png" 
              alt="Profile"
            />
            <AvatarFallback className="bg-yellow-400">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 glass-morphism border border-fundora-blue/30">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-gradient">{username || 'User'}</p>
          <Button variant="outline" className="w-full justify-start glass-morphism">
            My Profile
          </Button>
          <Button variant="outline" className="w-full justify-start glass-morphism">
            Settings
          </Button>
          <Button variant="outline" className="w-full justify-start glass-morphism">
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileButton;
