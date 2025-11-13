import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './../contexts/AuthContext';
import { AppRoutes } from './AppRoutes';
import { connection } from 'next/server';


async function App() {
    await connection()
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <AppRoutes />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
