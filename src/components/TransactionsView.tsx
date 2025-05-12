
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Search, 
  ArrowUpDown
} from 'lucide-react';

interface TransactionsViewProps {
  userId: string;
  limit?: number;
}

const TransactionsView = ({ userId, limit }: TransactionsViewProps) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    // Fetch transactions from localStorage
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Filter by current user
    const userTransactions = storedTransactions.filter((tx: any) => tx.user_id === userId);
    
    // Apply limit if provided
    const limitedTransactions = limit ? userTransactions.slice(0, limit) : userTransactions;
    
    setTransactions(limitedTransactions);
    setFilteredTransactions(limitedTransactions);
  }, [userId, limit]);
  
  useEffect(() => {
    let result = [...transactions];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(tx => 
        tx.transaction_hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortDirection === 'asc' 
          ? parseFloat(a.amount) - parseFloat(b.amount)
          : parseFloat(b.amount) - parseFloat(a.amount);
      }
    });
    
    setFilteredTransactions(result);
  }, [transactions, searchQuery, sortBy, sortDirection]);
  
  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-500 hover:bg-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-500 hover:bg-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search transactions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-fundora-blue/30 text-white"
            />
          </div>
        </div>
      )}
      
      <div className="border border-fundora-blue/30 rounded-lg overflow-hidden">
        <Table>
          {transactions.length === 0 ? (
            <TableCaption>No transactions found.</TableCaption>
          ) : (
            <TableCaption>A list of your recent transactions.</TableCaption>
          )}
          <TableHeader className="bg-fundora-blue/10">
            <TableRow className="border-fundora-blue/30">
              <TableHead className="text-fundora-cyan">Type</TableHead>
              <TableHead className="text-fundora-cyan">Status</TableHead>
              <TableHead className="text-fundora-cyan">
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent text-fundora-cyan hover:text-white"
                  onClick={() => toggleSort('amount')}
                >
                  Amount
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-fundora-cyan">
                <Button 
                  variant="ghost" 
                  className="p-0 hover:bg-transparent text-fundora-cyan hover:text-white"
                  onClick={() => toggleSort('date')}
                >
                  Date
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-fundora-cyan">Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow className="border-fundora-blue/30">
                <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-fundora-blue/30">
                  <TableCell className="text-white">{tx.type}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white font-mono">
                    ${parseFloat(tx.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {formatDate(tx.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 font-mono text-xs">
                        {truncateHash(tx.transaction_hash)}
                      </span>
                      {tx.transaction_chain_url && (
                        <a 
                          href={tx.transaction_chain_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-fundora-cyan hover:text-white"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsView;
