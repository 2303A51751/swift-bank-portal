import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDownLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { toast } from 'sonner';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
  const { deposit, currentAccount } = useBank();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleDeposit = () => {
    setError('');
    
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const result = deposit(numAmount);
    
    if (result) {
      setSuccess(true);
      toast.success('Deposit successful!', {
        description: `₹${numAmount.toLocaleString('en-IN')} has been added to your account.`
      });
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        onClose();
      }, 1500);
    } else {
      setError('Deposit failed. Please try again.');
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
          <div className="mx-auto w-14 h-14 rounded-2xl bg-banking-success/10 flex items-center justify-center mb-2">
            {success ? (
              <CheckCircle2 className="w-7 h-7 text-banking-success animate-scale-in" />
            ) : (
              <ArrowDownLeft className="w-7 h-7 text-banking-success" />
            )}
          </div>
          <DialogTitle className="text-center">
            {success ? 'Deposit Successful!' : 'Deposit Money'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {success 
              ? 'Your account has been credited.' 
              : 'Add funds to your account instantly'
            }
          </DialogDescription>
        </DialogHeader>

        {!success && (
          <div className="space-y-6 py-4">
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
                  >
                    ₹{quickAmount.toLocaleString('en-IN')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="depositAmount"
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

            {/* Current Balance Display */}
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Balance</span>
                <span className="font-medium">₹{currentAccount?.balance.toLocaleString('en-IN')}</span>
              </div>
              {amount && parseFloat(amount) > 0 && (
                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-border">
                  <span className="text-muted-foreground">After Deposit</span>
                  <span className="font-medium text-banking-success">
                    ₹{((currentAccount?.balance || 0) + parseFloat(amount)).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            <Button variant="success" size="lg" className="w-full" onClick={handleDeposit}>
              Deposit ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
