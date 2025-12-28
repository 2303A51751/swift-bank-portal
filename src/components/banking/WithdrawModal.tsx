import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { toast } from 'sonner';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  const { withdraw, currentAccount } = useBank();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];
  const isSavings = currentAccount?.type === 'savings';
  const withdrawLimit = isSavings ? 10000 : Infinity;

  const handleWithdraw = () => {
    setError('');
    
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const result = withdraw(numAmount);
    
    if (result.success) {
      setSuccess(true);
      toast.success('Withdrawal successful!', {
        description: `₹${numAmount.toLocaleString('en-IN')} has been withdrawn from your account.`
      });
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        onClose();
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
            {success ? (
              <CheckCircle2 className="w-7 h-7 text-banking-success animate-scale-in" />
            ) : (
              <ArrowUpRight className="w-7 h-7 text-destructive" />
            )}
          </div>
          <DialogTitle className="text-center">
            {success ? 'Withdrawal Successful!' : 'Withdraw Money'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {success 
              ? 'Your withdrawal has been processed.' 
              : 'Withdraw funds from your account'
            }
          </DialogDescription>
        </DialogHeader>

        {!success && (
          <div className="space-y-6 py-4">
            {/* Savings Account Warning */}
            {isSavings && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-banking-warning/10 border border-banking-warning/20">
                <AlertTriangle className="w-5 h-5 text-banking-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Savings Account Limit</p>
                  <p className="text-muted-foreground">Maximum withdrawal: ₹10,000 per transaction</p>
                </div>
              </div>
            )}

            {/* Quick Amount Selection */}
            <div className="space-y-2">
              <Label>Quick Select</Label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant={amount === quickAmount.toString() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="text-sm"
                    disabled={quickAmount > (currentAccount?.balance || 0)}
                  >
                    ₹{quickAmount.toLocaleString('en-IN')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="withdrawAmount">Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`pl-8 text-lg ${error ? 'border-destructive' : ''}`}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            {/* Balance Info */}
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-medium">₹{currentAccount?.balance.toLocaleString('en-IN')}</span>
              </div>
              {amount && parseFloat(amount) > 0 && parseFloat(amount) <= (currentAccount?.balance || 0) && (
                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-border">
                  <span className="text-muted-foreground">After Withdrawal</span>
                  <span className="font-medium">
                    ₹{((currentAccount?.balance || 0) - parseFloat(amount)).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            <Button variant="destructive" size="lg" className="w-full" onClick={handleWithdraw}>
              Withdraw ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
