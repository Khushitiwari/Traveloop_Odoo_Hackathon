

import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <Toaster position="top-right" />
        <AppRouter />
      </TripProvider>
    </AuthProvider>
  );
}