import React, { createContext, useContext, useState, useCallback } from 'react';
import { Account, AccountType, Transaction, BankState } from '@/types/banking';

interface BankContextType extends BankState {
  createAccount: (accountNumber: number, password: string, balance: number, type: AccountType) => boolean;
  login: (accountNumber: number, password: string) => Account | null;
  logout: () => void;
  deposit: (amount: number) => boolean;
  withdraw: (amount: number) => { success: boolean; message: string };
  transfer: (toAccountNumber: number, amount: number) => { success: boolean; message: string };
  findAccount: (accountNumber: number) => Account | null;
  generateCaptcha: () => number;
  getAccountTransactions: () => Transaction[];
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const findAccount = useCallback((accountNumber: number): Account | null => {
    return accounts.find(acc => acc.accountNumber === accountNumber) || null;
  }, [accounts]);

  const createAccount = useCallback((
    accountNumber: number, 
    password: string, 
    balance: number, 
    type: AccountType
  ): boolean => {
    if (findAccount(accountNumber)) {
      return false;
    }
    
    const newAccount: Account = {
      accountNumber,
      password,
      balance,
      type,
      createdAt: new Date()
    };
    
    setAccounts(prev => [...prev, newAccount]);
    return true;
  }, [findAccount]);

  const login = useCallback((accountNumber: number, password: string): Account | null => {
    const account = findAccount(accountNumber);
    if (account && account.password === password) {
      setCurrentAccount(account);
      return account;
    }
    return null;
  }, [findAccount]);

  const logout = useCallback(() => {
    setCurrentAccount(null);
  }, []);

  const updateAccountBalance = useCallback((accountNumber: number, newBalance: number) => {
    setAccounts(prev => prev.map(acc => 
      acc.accountNumber === accountNumber 
        ? { ...acc, balance: newBalance }
        : acc
    ));
    
    if (currentAccount?.accountNumber === accountNumber) {
      setCurrentAccount(prev => prev ? { ...prev, balance: newBalance } : null);
    }
  }, [currentAccount]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const deposit = useCallback((amount: number): boolean => {
    if (!currentAccount || amount <= 0) return false;
    
    const newBalance = currentAccount.balance + amount;
    updateAccountBalance(currentAccount.accountNumber, newBalance);
    
    addTransaction({
      type: 'deposit',
      amount,
      description: 'Cash deposit'
    });
    
    return true;
  }, [currentAccount, updateAccountBalance, addTransaction]);

  const withdraw = useCallback((amount: number): { success: boolean; message: string } => {
    if (!currentAccount || amount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }

    // Savings account limit check
    if (currentAccount.type === 'savings' && amount > 10000) {
      return { success: false, message: 'Withdrawal limit exceeded. Maximum ₹10,000 per transaction for savings account.' };
    }

    if (amount > currentAccount.balance) {
      return { success: false, message: 'Insufficient balance' };
    }

    const newBalance = currentAccount.balance - amount;
    updateAccountBalance(currentAccount.accountNumber, newBalance);
    
    addTransaction({
      type: 'withdraw',
      amount,
      description: 'Cash withdrawal'
    });
    
    return { success: true, message: 'Withdrawal successful' };
  }, [currentAccount, updateAccountBalance, addTransaction]);

  const transfer = useCallback((toAccountNumber: number, amount: number): { success: boolean; message: string } => {
    if (!currentAccount || amount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }

    if (toAccountNumber === currentAccount.accountNumber) {
      return { success: false, message: 'Cannot transfer to same account' };
    }

    const targetAccount = findAccount(toAccountNumber);
    if (!targetAccount) {
      return { success: false, message: 'Target account not found' };
    }

    // Savings account limit check
    if (currentAccount.type === 'savings' && amount > 10000) {
      return { success: false, message: 'Transfer limit exceeded. Maximum ₹10,000 per transaction for savings account.' };
    }

    if (amount > currentAccount.balance) {
      return { success: false, message: 'Insufficient balance' };
    }

    // Deduct from current account
    updateAccountBalance(currentAccount.accountNumber, currentAccount.balance - amount);
    
    // Add to target account
    updateAccountBalance(toAccountNumber, targetAccount.balance + amount);
    
    addTransaction({
      type: 'transfer',
      amount,
      toAccount: toAccountNumber,
      fromAccount: currentAccount.accountNumber,
      description: `Transfer to Account ${toAccountNumber}`
    });
    
    return { success: true, message: 'Transfer successful' };
  }, [currentAccount, findAccount, updateAccountBalance, addTransaction]);

  const generateCaptcha = useCallback((): number => {
    return 1000 + Math.floor(Math.random() * 9000);
  }, []);

  const getAccountTransactions = useCallback((): Transaction[] => {
    if (!currentAccount) return [];
    return transactions.filter(t => 
      t.fromAccount === currentAccount.accountNumber || 
      t.toAccount === currentAccount.accountNumber ||
      (t.type !== 'transfer')
    );
  }, [currentAccount, transactions]);

  return (
    <BankContext.Provider value={{
      accounts,
      currentAccount,
      transactions,
      createAccount,
      login,
      logout,
      deposit,
      withdraw,
      transfer,
      findAccount,
      generateCaptcha,
      getAccountTransactions
    }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
