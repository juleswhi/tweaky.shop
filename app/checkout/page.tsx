import { AuthProvider } from '../../contexts/AuthContext';
import { CheckoutRoutes } from '../AppRoutes';
import { connection } from 'next/server';

export default async function CheckoutPageWrapper() {
    await connection()

    return (
        <AuthProvider>
            <div className="App">
                <CheckoutRoutes />
            </div>
        </AuthProvider>
    );
}
