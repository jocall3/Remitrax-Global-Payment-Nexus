
export enum View {
  Dashboard = 'dashboard',
  SendMoney = 'send_money',
  Transactions = 'transactions',
  Settings = 'settings'
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income' | 'scheduled_expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  carbonFootprint: number;
  isScheduled?: boolean;
  scheduledRule?: any;
}

export interface UserPreferences {
  defaultCarbonOffset: number;
  currency: string;
  theme: 'dark' | 'light';
}

export interface UserSecurityProfile {
  mfAuthMethods: ('fingerprint' | 'voice' | 'retinal_scan' | 'neural_pattern' | 'face')[];
  approvalRequiredBy: string[];
}
