export type AccountType = 'savings' | 'current';

export interface Account {
  accountNumber: number;
  password: string;
  balance: number;
  type: AccountType;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  timestamp: Date;
  toAccount?: number;
  fromAccount?: number;
  description?: string;
}

export interface BankState {
  accounts: Account[];
  currentAccount: Account | null;
  transactions: Transaction[];
}
