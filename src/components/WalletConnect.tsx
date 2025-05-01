
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bitcoin, Ethereum, Wallet } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'brave' | '';

const WalletConnect = () => {
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType>('');

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
      
      // In a real implementation, this would connect to the actual wallet
      // For now, we'll just show a success message
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletType}`,
      });
      
      // Simulate account creation process
      // In production, you would handle the wallet connection response
      // and create an account with the connected wallet address
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
      icon: <Ethereum className="h-6 w-6 text-orange-400" />,
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
      icon: <Ethereum className="h-6 w-6 text-orange-500" />,
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
    </div>
  );
};

export default WalletConnect;
