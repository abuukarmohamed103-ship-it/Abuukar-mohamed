
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Customer, Transaction } from './types';

const STORAGE_KEY = 'deenraac_data';

const DEFAULT_STATE: AppState = {
  customers: [],
  transactions: [],
  businessInfo: {
    name: 'My Business',
    owner: 'Business Owner',
    currency: '$',
  }
};

interface StoreContextType {
  state: AppState;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'balance'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  updateBusinessInfo: (info: AppState['businessInfo']) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Fix: Use React.createElement instead of JSX because this is a .ts file, resolving parsing errors and ensuring the return type matches React.FC.
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    try {
      return saved ? JSON.parse(saved) : DEFAULT_STATE;
    } catch (e) {
      console.error("Failed to parse stored data", e);
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'balance'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      customers: [...prev.customers, newCustomer],
    }));
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setState(prev => ({
      ...prev,
      customers: prev.customers.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const deleteCustomer = (id: string) => {
    setState(prev => ({
      ...prev,
      customers: prev.customers.filter(c => c.id !== id),
      transactions: prev.transactions.filter(t => t.customerId !== id)
    }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setState(prev => {
      const updatedCustomers = prev.customers.map(c => {
        if (c.id === transaction.customerId) {
          const amountChange = transaction.type === 'TAKEN' ? transaction.amount : -transaction.amount;
          return { ...c, balance: c.balance + amountChange };
        }
        return c;
      });

      return {
        ...prev,
        customers: updatedCustomers,
        transactions: [newTransaction, ...prev.transactions],
      };
    });
  };

  const deleteTransaction = (id: string) => {
    setState(prev => {
      const transaction = prev.transactions.find(t => t.id === id);
      if (!transaction) return prev;

      const updatedCustomers = prev.customers.map(c => {
        if (c.id === transaction.customerId) {
          const amountChange = transaction.type === 'TAKEN' ? -transaction.amount : transaction.amount;
          return { ...c, balance: c.balance + amountChange };
        }
        return c;
      });

      return {
        ...prev,
        customers: updatedCustomers,
        transactions: prev.transactions.filter(t => t.id !== id),
      };
    });
  };

  const updateBusinessInfo = (info: AppState['businessInfo']) => {
    setState(prev => ({ ...prev, businessInfo: info }));
  };

  const resetData = () => {
    setState(DEFAULT_STATE);
  };

  // Fix: Using React.createElement ensures compatibility within a .ts file that does not support JSX syntax.
  return React.createElement(StoreContext.Provider, {
    value: {
      state,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addTransaction,
      deleteTransaction,
      updateBusinessInfo,
      resetData
    }
  }, children);
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
