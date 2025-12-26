
export type TransactionType = 'TAKEN' | 'PAID';

export interface Transaction {
  id: string;
  customerId: string;
  type: TransactionType;
  item: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
  createdAt: string;
}

export interface AppState {
  customers: Customer[];
  transactions: Transaction[];
  businessInfo: {
    name: string;
    owner: string;
    currency: string;
  };
}
