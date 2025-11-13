"use client"
import { useAuth } from '@/contexts/AuthContext';
import PasscodePrompt from '@/components/PasscodePrompt';
import ShopPage from './shop/ShopPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PasscodePrompt />;
  }

  return <ShopPage />;
};

export default AppRoutes;
