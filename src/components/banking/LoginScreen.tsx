import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Building2, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { toast } from 'sonner';

interface LoginScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

const LoginScreen = ({ onBack, onSuccess }: LoginScreenProps) => {
  const { login, findAccount, generateCaptcha } = useBank();
  const [step, setStep] = useState<'credentials' | 'captcha'>('credentials');
  const [formData, setFormData] = useState({
    accountNumber: '',
    password: '',
    captchaInput: ''
  });
  const [captcha, setCaptcha] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, [generateCaptcha]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData({ ...formData, captchaInput: '' });
  };

  const validateCredentials = () => {
    const newErrors: Record<string, string> = {};
    
    const account = findAccount(parseInt(formData.accountNumber));
    
    if (!formData.accountNumber) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!account) {
      newErrors.accountNumber = 'Account not found';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (account && !account.password) {
      // Password check will happen on actual login
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialsSubmit = () => {
    if (validateCredentials()) {
      setStep('captcha');
      refreshCaptcha();
    }
  };

  const handleLogin = () => {
    if (formData.captchaInput !== captcha.toString()) {
      setErrors({ captcha: 'Invalid captcha. Please try again.' });
      refreshCaptcha();
      return;
    }

    const account = login(parseInt(formData.accountNumber), formData.password);
    
    if (account) {
      toast.success('Login successful!', {
        description: `Welcome back! Account: ${account.accountNumber}`
      });
      onSuccess();
    } else {
      toast.error('Login failed', {
        description: 'Incorrect password'
      });
      setStep('credentials');
      setErrors({ password: 'Incorrect password' });
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
            <span className="font-display text-xl font-semibold text-foreground">Login</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          {step === 'credentials' ? (
            <Card className="animate-fade-in-up">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="number"
                    placeholder="Enter your account number"
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
                    placeholder="Enter your password"
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

                <Button variant="banking" size="lg" className="w-full mt-6" onClick={handleCredentialsSubmit}>
                  Continue
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-scale-in">
              <CardHeader className="text-center">
                <CardTitle>Security Verification</CardTitle>
                <CardDescription>Enter the captcha code shown below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="px-8 py-4 bg-muted rounded-xl border-2 border-dashed border-border">
                    <span className="font-display text-3xl font-bold tracking-wider text-primary select-none">
                      {captcha}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={refreshCaptcha} className="shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captcha">Enter Captcha</Label>
                  <Input
                    id="captcha"
                    type="number"
                    placeholder="Enter the code above"
                    value={formData.captchaInput}
                    onChange={(e) => setFormData({ ...formData, captchaInput: e.target.value })}
                    className={`text-center text-lg ${errors.captcha ? 'border-destructive' : ''}`}
                  />
                  {errors.captcha && (
                    <p className="text-sm text-destructive flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.captcha}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep('credentials')} className="flex-1">
                    Back
                  </Button>
                  <Button variant="banking" size="lg" onClick={handleLogin} className="flex-1">
                    Login
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

export default LoginScreen;
