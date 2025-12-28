import { useState } from 'react';
import { BankProvider } from '@/context/BankContext';
import WelcomeScreen from '@/components/banking/WelcomeScreen';
import LoginScreen from '@/components/banking/LoginScreen';
import RegisterScreen from '@/components/banking/RegisterScreen';
import Dashboard from '@/components/banking/Dashboard';

type Screen = 'welcome' | 'login' | 'register' | 'dashboard';

const BankingApp = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onLogin={() => setCurrentScreen('login')}
            onRegister={() => setCurrentScreen('register')}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onBack={() => setCurrentScreen('welcome')}
            onSuccess={() => setCurrentScreen('dashboard')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onBack={() => setCurrentScreen('welcome')}
            onSuccess={() => setCurrentScreen('welcome')}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            onLogout={() => setCurrentScreen('welcome')}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderScreen()}</>;
};

const Index = () => {
  return (
    <BankProvider>
      <BankingApp />
    </BankProvider>
  );
};

export default Index;
