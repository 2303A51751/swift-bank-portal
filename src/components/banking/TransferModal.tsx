import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { toast } from 'sonner';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransferModal = ({ isOpen, onClose }: TransferModalProps) => {
  const { transfer, currentAccount, findAccount } = useBank();
  const [step, setStep] = useState<'details' | 'confirm'>('details');
  const [formData, setFormData] = useState({
    toAccount: '',
    amount: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isSavings = currentAccount?.type === 'savings';
  const targetAccount = findAccount(parseInt(formData.toAccount));

  const validateDetails = () => {
    setError('');
    
    if (!formData.toAccount) {
      setError('Please enter the recipient account number');
      return false;
    }
    
    if (!targetAccount) {
      setError('Account not found');
      return false;
    }
    
    if (parseInt(formData.toAccount) === currentAccount?.accountNumber) {
      setError('Cannot transfer to the same account');
      return false;
    }
    
    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (numAmount > (currentAccount?.balance || 0)) {
      setError('Insufficient balance');
      return false;
    }
    
    if (isSavings && numAmount > 10000) {
      setError('Transfer limit exceeded. Maximum ₹10,000 per transaction for savings account.');
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (validateDetails()) {
      setStep('confirm');
    }
  };

  const handleTransfer = () => {
    const result = transfer(parseInt(formData.toAccount), parseFloat(formData.amount));
    
    if (result.success) {
      setSuccess(true);
      toast.success('Transfer successful!', {
        description: `₹${parseFloat(formData.amount).toLocaleString('en-IN')} sent to Account ${formData.toAccount}`
      });
      setTimeout(() => {
        handleClose();
      }, 1500);
    } else {
      setError(result.message);
      setStep('details');
    }
  };

  const handleClose = () => {
    setFormData({ toAccount: '', amount: '' });
    setError('');
    setSuccess(false);
    setStep('details');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            {success ? (
              <CheckCircle2 className="w-7 h-7 text-banking-success animate-scale-in" />
            ) : (
              <Send className="w-7 h-7 text-primary" />
            )}
          </div>
          <DialogTitle className="text-center">
            {success 
              ? 'Transfer Successful!' 
              : step === 'confirm' 
              ? 'Confirm Transfer' 
              : 'Transfer Money'
            }
          </DialogTitle>
          <DialogDescription className="text-center">
            {success 
              ? 'Your transfer has been completed.' 
              : step === 'confirm'
              ? 'Please review the details below'
              : 'Send money to another account'
            }
          </DialogDescription>
        </DialogHeader>

        {!success && step === 'details' && (
          <div className="space-y-6 py-4">
            {/* Savings Account Warning */}
            {isSavings && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-banking-warning/10 border border-banking-warning/20">
                <AlertTriangle className="w-5 h-5 text-banking-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Savings Account Limit</p>
                  <p className="text-muted-foreground">Maximum transfer: ₹10,000 per transaction</p>
                </div>
              </div>
            )}

            {/* Recipient Account */}
            <div className="space-y-2">
              <Label htmlFor="toAccount">Recipient Account Number</Label>
              <Input
                id="toAccount"
                type="number"
                placeholder="Enter account number"
                value={formData.toAccount}
                onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                className={error && !targetAccount ? 'border-destructive' : ''}
              />
              {targetAccount && (
                <div className="flex items-center gap-2 text-sm text-banking-success">
                  <CheckCircle2 className="w-4 h-4" />
                  Account found
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="transferAmount">Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="transferAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-8 text-lg"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}

            {/* Balance Info */}
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-medium">₹{currentAccount?.balance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button variant="banking" size="lg" className="w-full" onClick={handleContinue}>
              Continue
            </Button>
          </div>
        )}

        {!success && step === 'confirm' && (
          <div className="space-y-6 py-4">
            {/* Transfer Summary */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sending to</p>
                    <p className="font-medium">Account {formData.toAccount}</p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="font-display text-2xl font-bold text-primary">
                    ₹{parseFloat(formData.amount).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">After Transfer</span>
                  <span className="font-medium">
                    ₹{((currentAccount?.balance || 0) - parseFloat(formData.amount)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep('details')} className="flex-1">
                Back
              </Button>
              <Button variant="banking" size="lg" onClick={handleTransfer} className="flex-1">
                Confirm Transfer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
