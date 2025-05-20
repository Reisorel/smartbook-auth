import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import AppRouter from './router/AppRouter';
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
