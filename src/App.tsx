import ProtectedRoutes from './components/shared/ProtectedRoutes';
import AppProvider from './providers';
import AppRouter from './routes';
import { Toaster } from 'react-hot-toast';
export default function App() {
  return (
    <AppProvider>
      <ProtectedRoutes>
        <AppRouter />
        <Toaster />
      </ProtectedRoutes>
    </AppProvider>
  );
}
