import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { CheckoutRoutes } from '../AppRoutes';


function App() {
  return (
      <AuthProvider>
        <div className="App">
          <CheckoutRoutes />
        </div>
      </AuthProvider>
  );
}

export default App;

