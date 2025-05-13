
// Database Types

// User type
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  profile_image: string | null;
  account_type: 'SME' | 'Investor';
  eth_address: string;
  created_at: string;
  updated_at: string;
  isLoggedIn?: boolean; // UI state, not stored in DB
  walletType?: string; // For UI, not in DB schema
}

// Invoice type
export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: string;
  duration: string;
  dueDate: string;
  uploadedFile: string; // IPFS hash
  description?: string;
  status: 'Available' | 'Funded' | 'Expired' | 'Completed';
  created_at: string;
  updated_at: string;
  userId: string; // Foreign key to User
  
  // Additional fields for UI purposes
  fileName?: string;
  previewUrl?: string;
  investor_id?: string; // ID of investor who funded this invoice
}

// Investment type
export interface Investment {
  id: string;
  invoice_id: string;
  investor_id: string;
  amount: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Refunded';
  transaction_hash: string;
  return_amount: string;
  return_date: string;
  created_at: string;
  updated_at: string;
  
  // For UI joining
  invoice?: Invoice;
  investor?: User;
}

// Transaction type
export interface Transaction {
  id: string;
  user_id: string;
  investment_id?: string;
  invoice_id?: string;
  type: 'Investment' | 'Return' | 'Fee' | string;
  amount: string;
  status: 'Pending' | 'Completed' | 'Failed';
  transaction_hash: string;
  transaction_chain_url?: string;
  created_at: string;
}

// LocalStorage keys for our "database"
export const DB_KEYS = {
  USERS: 'users',
  USER: 'user', // Current logged in user
  INVOICES: 'invoices',
  INVESTMENTS: 'investments',
  TRANSACTIONS: 'transactions'
};
