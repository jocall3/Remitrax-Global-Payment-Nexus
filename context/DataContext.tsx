
import React, { createContext, useState, useEffect } from 'react';
import { Transaction, UserPreferences, UserSecurityProfile } from '../types';

interface DataContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  userPreferences: UserPreferences;
  userSecurityProfile: UserSecurityProfile;
}

export const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_init_1',
      type: 'expense',
      category: 'Transfer',
      description: 'Initial balance seeding',
      amount: 1000,
      date: new Date().toISOString().split('T')[0],
      carbonFootprint: 0.05
    }
  ]);

  const [userPreferences] = useState<UserPreferences>({
    defaultCarbonOffset: 0.15,
    currency: 'USD',
    theme: 'dark'
  });

  const [userSecurityProfile] = useState<UserSecurityProfile>({
    mfAuthMethods: ['face', 'fingerprint', 'retinal_scan'],
    approvalRequiredBy: []
  });

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  return (
    <DataContext.Provider value={{ 
      transactions, 
      addTransaction, 
      userPreferences, 
      userSecurityProfile 
    }}>
      {children}
    </DataContext.Provider>
  );
};
