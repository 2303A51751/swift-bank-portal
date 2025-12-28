import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Shield, Zap, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const WelcomeScreen = ({ onLogin, onRegister }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">SecureBank</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="w-4 h-4" />
              Trusted by thousands
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Welcome to<br />
              <span className="text-primary">SecureBank</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your trusted partner for seamless and secure banking operations.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-4 opacity-0 animate-fade-in-up stagger-2">
            <Card className="hover-lift cursor-default">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Secure Transactions</h3>
                  <p className="text-sm text-muted-foreground">Protected with captcha verification</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-default">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-banking-success/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-banking-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Instant Transfers</h3>
                  <p className="text-sm text-muted-foreground">Quick deposits and withdrawals</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 opacity-0 animate-fade-in-up stagger-3">
            <Button 
              variant="banking" 
              size="xl" 
              className="w-full group"
              onClick={onLogin}
            >
              Existing User - Login
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="w-full"
              onClick={onRegister}
            >
              New User - Create Account
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground animate-fade-in">
        <p>© 2024 SecureBank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
