
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DollarSign, Bitcoin, Wallet } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'brave' | '';

interface WalletConnectProps {
  onAccountCreated?: (username: string) => void;
  userRole?: string;
}

// Define form schema with validation
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  fullName: z.string().min(3, {
    message: "Full name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const WalletConnect = ({ onAccountCreated, userRole = "sme" }: WalletConnectProps) => {
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType>('');
  const [step, setStep] = useState<'credentials' | 'wallet'>('credentials');
  const [username, setUsername] = useState("");
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmitCredentials = (data: z.infer<typeof formSchema>) => {
    // Store credentials and move to wallet connection step
    console.log("Submitted credentials:", data);
    setUsername(data.username);
    toast({
      title: "Account details saved",
      description: `Username: ${data.username}`,
    });
    setStep('wallet');
  };

  const detectWallet = (): { available: WalletType[], default: WalletType } => {
    const available: WalletType[] = [];
    let defaultWallet: WalletType = '';
    
    // Check for window ethereum provider
    if (typeof window !== 'undefined') {
      const ethereum = (window as any).ethereum;
      
      if (ethereum) {
        // Check for MetaMask
        if (ethereum.isMetaMask) {
          available.push('metamask');
          defaultWallet = 'metamask';
        }
        
        // Check for Brave Wallet
        if (ethereum.isBraveWallet) {
          available.push('brave');
          if (!defaultWallet) defaultWallet = 'brave';
        }
        
        // Check for Coinbase Wallet
        if (ethereum.isCoinbaseWallet) {
          available.push('coinbase');
          if (!defaultWallet) defaultWallet = 'coinbase';
        }
      }
      
      // WalletConnect is always available as an option
      available.push('walletconnect');
    }
    
    return { available, default: defaultWallet };
  };

  const connectWallet = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    setConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we'd get the actual ETH address from the wallet connection
      const mockEthAddress = "0x" + Math.random().toString(16).substr(2, 40);
      
      toast({
        title: "Account Created Successfully",
        description: `${userRole === "sme" ? "SME" : "Investor"} account created and connected to ${walletType}`,
      });
      
      // Create timestamp for created_at and updated_at
      const timestamp = new Date().toISOString();
      
      // Save user data in localStorage
      const userData = {
        id: crypto.randomUUID(), // Generate UUID
        username: username,
        email: form.getValues("email"),
        password_hash: form.getValues("password"), // In a real app, we'd hash this
        full_name: form.getValues("fullName"),
        profile_image: null, // Default to null
        account_type: userRole === "sme" ? "SME" : "Investor",
        eth_address: mockEthAddress,
        created_at: timestamp,
        updated_at: timestamp,
        isLoggedIn: true,
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Notify parent component about account creation
      if (onAccountCreated && username) {
        onAccountCreated(username);
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const { available, default: defaultWallet } = detectWallet();

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: <DollarSign className="h-6 w-6 text-orange-400" />,
      description: 'Connect using browser extension',
      disabled: !available.includes('metamask')
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: <Bitcoin className="h-6 w-6 text-blue-500" />,
      description: 'Connect with Coinbase Wallet',
      disabled: !available.includes('coinbase')
    },
    {
      id: 'brave',
      name: 'Brave Wallet',
      icon: <DollarSign className="h-6 w-6 text-orange-500" />,
      description: 'Connect with Brave Browser Wallet',
      disabled: !available.includes('brave')
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: <Wallet className="h-6 w-6 text-blue-400" />,
      description: 'Connect with mobile wallet',
      disabled: false
    }
  ];

  return (
    <div className="py-4">
      {step === 'credentials' ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitCredentials)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (.base.eth)</FormLabel>
                  <FormControl>
                    <Input placeholder="username.base.eth" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-fundora-blue to-fundora-cyan text-white">
              Next: Connect Wallet
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                disabled={connecting || wallet.disabled}
                className={`w-full justify-start gap-3 py-6 glass-morphism border border-white/10 ${
                  selectedWallet === wallet.id ? 'border-fundora-cyan' : 'hover:border-fundora-blue/50'
                }`}
                onClick={() => connectWallet(wallet.id as WalletType)}
              >
                {wallet.icon}
                <div className="flex flex-col items-start">
                  <span className="font-medium">{wallet.name}</span>
                  <span className="text-xs text-gray-400">{wallet.description}</span>
                </div>
                {wallet.disabled && (
                  <span className="ml-auto text-xs text-gray-500">Not detected</span>
                )}
                {connecting && selectedWallet === wallet.id && (
                  <span className="ml-auto">
                    <svg className="animate-spin h-5 w-5 text-fundora-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
              </Button>
            ))}
          </div>

          <p className="mt-6 text-sm text-center text-gray-400">
            By connecting a wallet, you agree to Fundora's Terms of Service and Privacy Policy
          </p>
        </>
      )}
    </div>
  );
};

export default WalletConnect;
