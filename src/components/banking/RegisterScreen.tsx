import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Building2, Check, AlertCircle, Wallet, PiggyBank } from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { AccountType } from '@/types/banking';
import { toast } from 'sonner';

interface RegisterScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

const RegisterScreen = ({ onBack, onSuccess }: RegisterScreenProps) => {
  const { createAccount, findAccount } = useBank();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    accountNumber: '',
    password: '',
    confirmPassword: '',
    initialAmount: '',
    accountType: 'savings' as AccountType
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.accountNumber || formData.accountNumber.length < 4) {
      newErrors.accountNumber = 'Account number must be at least 4 digits';
    } else if (findAccount(parseInt(formData.accountNumber))) {
      newErrors.accountNumber = 'This account number already exists';
    }
    
    if (!formData.password || formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    const amount = parseFloat(formData.initialAmount);
    if (!formData.initialAmount || isNaN(amount) || amount < 0) {
      newErrors.initialAmount = 'Please enter a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    
    const success = createAccount(
      parseInt(formData.accountNumber),
      formData.password,
      parseFloat(formData.initialAmount),
      formData.accountType
    );
    
    if (success) {
      toast.success('Account created successfully!', {
        description: `Your ${formData.accountType} account is ready.`
      });
      onSuccess();
    } else {
      toast.error('Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">Create Account</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="px-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
            step >= 1 ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
            step > 1 ? 'bg-primary' : 'bg-muted'
          }`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
            step >= 2 ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Enter your account credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="number"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className={errors.accountNumber ? 'border-destructive' : ''}
                  />
                  {errors.accountNumber && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button variant="banking" size="lg" className="w-full mt-6" onClick={handleNext}>
                  Continue
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle>Account Setup</CardTitle>
                <CardDescription>Choose your account type and initial deposit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={formData.accountType}
                    onValueChange={(value) => setFormData({ ...formData, accountType: value as AccountType })}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="savings"
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.accountType === 'savings'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="savings" id="savings" className="sr-only" />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        formData.accountType === 'savings' ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <PiggyBank className={`w-6 h-6 ${
                          formData.accountType === 'savings' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Savings</p>
                        <p className="text-xs text-muted-foreground">₹10k limit/txn</p>
                      </div>
                    </Label>

                    <Label
                      htmlFor="current"
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        formData.accountType === 'current'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="current" id="current" className="sr-only" />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        formData.accountType === 'current' ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Wallet className={`w-6 h-6 ${
                          formData.accountType === 'current' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Current</p>
                        <p className="text-xs text-muted-foreground">No limit</p>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialAmount">Initial Deposit Amount (₹)</Label>
                  <Input
                    id="initialAmount"
                    type="number"
                    placeholder="Enter initial amount"
                    value={formData.initialAmount}
                    onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                    className={errors.initialAmount ? 'border-destructive' : ''}
                  />
                  {errors.initialAmount && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.initialAmount}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button variant="banking" size="lg" onClick={handleSubmit} className="flex-1">
                    Create Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default RegisterScreen;
