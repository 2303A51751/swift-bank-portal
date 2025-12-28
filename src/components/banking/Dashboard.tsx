import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  LogOut, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Send, 
  Eye,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Wallet
} from 'lucide-react';
import { useBank } from '@/context/BankContext';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import TransferModal from './TransferModal';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const { currentAccount, getAccountTransactions } = useBank();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const transactions = getAccountTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (!currentAccount) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 border-b border-border animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">SecureBank</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {/* Account Info Card */}
        <Card className="overflow-hidden animate-fade-in-up">
          <div className="gradient-primary p-6 text-primary-foreground">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-primary-foreground/80 text-sm">Account Number</p>
                <p className="font-display text-lg font-semibold">{currentAccount.accountNumber}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentAccount.type === 'savings' 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-primary-foreground/20'
              }`}>
                {currentAccount.type === 'savings' ? (
                  <span className="flex items-center gap-1">
                    <PiggyBank className="w-3 h-3" /> Savings
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> Current
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-primary-foreground/80 text-sm">Available Balance</p>
              <div className="flex items-center gap-3">
                <p className="font-display text-3xl font-bold">
                  {showBalance ? formatCurrency(currentAccount.balance) : '₹ ••••••'}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  <Eye className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>
                {currentAccount.type === 'savings' 
                  ? 'Withdrawal limit: ₹10,000 per transaction' 
                  : 'No withdrawal limit'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 opacity-0 animate-fade-in-up stagger-2">
          <Card 
            className="cursor-pointer hover-lift" 
            onClick={() => setShowDeposit(true)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
              <div className="w-12 h-12 rounded-xl bg-banking-success/10 flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-banking-success" />
              </div>
              <span className="text-sm font-medium text-foreground">Deposit</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover-lift" 
            onClick={() => setShowWithdraw(true)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-destructive" />
              </div>
              <span className="text-sm font-medium text-foreground">Withdraw</span>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover-lift" 
            onClick={() => setShowTransfer(true)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Transfer</span>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="opacity-0 animate-fade-in-up stagger-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions yet</p>
                <p className="text-sm">Your transactions will appear here</p>
              </div>
            ) : (
              transactions.slice(0, 5).map((transaction, index) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === 'deposit' 
                        ? 'bg-banking-success/10' 
                        : transaction.type === 'withdraw'
                        ? 'bg-destructive/10'
                        : 'bg-primary/10'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowDownLeft className="w-5 h-5 text-banking-success" />
                      ) : transaction.type === 'withdraw' ? (
                        <ArrowUpRight className="w-5 h-5 text-destructive" />
                      ) : (
                        <Send className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">{transaction.type}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(transaction.timestamp)}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'deposit' 
                      ? 'text-banking-success' 
                      : 'text-destructive'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
      <WithdrawModal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} />
      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} />
    </div>
  );
};

export default Dashboard;
