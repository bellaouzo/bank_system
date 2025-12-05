
export interface Account {
  id: string;
  type: 'Checking' | 'Savings' | 'Credit Card' | 'Investment';
  name: string;
  balance: number;
  number: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  accountId: string;
  status: 'posted' | 'pending';
}

export const accounts: Account[] = [
  {
    id: '1',
    type: 'Checking',
    name: 'Total Checking',
    balance: 4523.50,
    number: '...8842',
    trend: 'up'
  },
  {
    id: '2',
    type: 'Savings',
    name: 'Premier Savings',
    balance: 12500.00,
    number: '...9921',
    trend: 'up'
  },
  {
    id: '3',
    type: 'Credit Card',
    name: 'Freedom Unlimited',
    balance: 842.15,
    number: '...4550',
    trend: 'down'
  },
  {
    id: '4',
    type: 'Investment',
    name: 'Self-Directed Investing',
    balance: 34250.75,
    number: '...2210',
    trend: 'up'
  }
];

export const recentTransactions: Transaction[] = [
  {
    id: 't1',
    date: '2024-05-15',
    description: 'Grocery Store Market',
    amount: -154.32,
    type: 'debit',
    category: 'Groceries',
    accountId: '1',
    status: 'posted'
  },
  {
    id: 't2',
    date: '2024-05-14',
    description: 'Direct Deposit - Employer Inc',
    amount: 3200.00,
    type: 'credit',
    category: 'Income',
    accountId: '1',
    status: 'posted'
  },
  {
    id: 't3',
    date: '2024-05-14',
    description: 'Electric Company Util',
    amount: -85.00,
    type: 'debit',
    category: 'Utilities',
    accountId: '1',
    status: 'posted'
  },
  {
    id: 't4',
    date: '2024-05-13',
    description: 'Coffee Shop Brew',
    amount: -5.40,
    type: 'debit',
    category: 'Dining',
    accountId: '1',
    status: 'posted'
  },
  {
    id: 't5',
    date: '2024-05-12',
    description: 'Transfer to Savings',
    amount: -500.00,
    type: 'debit',
    category: 'Transfer',
    accountId: '1',
    status: 'posted'
  },
  {
    id: 't6',
    date: '2024-05-12',
    description: 'Gas Station Fuel',
    amount: -45.00,
    type: 'debit',
    category: 'Transport',
    accountId: '3',
    status: 'pending'
  }
];
