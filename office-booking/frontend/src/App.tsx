import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';

// To jest nasz "Strażnik Teksasu" po stronie Reacta. 
// Owijamy w niego każdą prywatną stronę (np. Dashboard).
// Jeśli ktoś nie ma biletu, brutalnie odsyłamy go na /login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    // AuthProvider to nasz Mózg z poprzedniego kroku
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Strona publiczna - Logowanie */}
          <Route path="/login" element={<Login />} />
          
          {/* Strona publiczna - Rejestracja */}
          <Route path="/register" element={<Register />} />

          {/* Strona chroniona - Nasze Biurka */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
