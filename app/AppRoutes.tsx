"use client"
import { useAuth } from '@/contexts/AuthContext';
import PasscodePrompt from '@/components/PasscodePrompt';
import ShopPage from './ShopPage';
import CheckoutPage from './checkout/cart';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PasscodePrompt />;
  }

  return <ShopPage />;
};

export const CheckoutRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated) {
        return <PasscodePrompt />
    }

    return <CheckoutPage />
};

