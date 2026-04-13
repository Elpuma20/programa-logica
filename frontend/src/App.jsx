import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TruthTable from './pages/TruthTable';
import LogicLesson from './pages/LogicLesson';
import Profile from './pages/Profile';
import LogicGames from './pages/LogicGames';
import AdminPanel from './pages/AdminPanel';
import SetTheoryLab from './pages/SetTheory';
import PredicateLogicLesson from './pages/PredicateLogic';
import SettingsPage from './pages/Settings';
import InferenceLogic from './pages/InferenceLogic';
import BooleanAlgebra from './pages/BooleanAlgebra';
import PasswordRecovery from './pages/PasswordRecovery';
import { BrainCircuit } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return (
    <div className="flex-center w-full" style={{ minHeight: '80vh' }}>
      <div className="fade-in" style={{ textAlign: 'center' }}>
        <div className="flex-center mb-4">
            <div style={{
                width: 60, height: 60, borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.2)'
            }}>
                <BrainCircuit size={32} />
            </div>
        </div>
        <h2 className="text-gradient">Iniciando EduLógica...</h2>
      </div>
    </div>
  );
  return token ? children : <Navigate to="/login" />;
};

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const AppContent = () => {
  const { token } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main style={{ flex: 1, paddingBottom: '4rem' }}>
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/recuperar" element={<PasswordRecovery />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/configuracion" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/leccion" element={<PrivateRoute><LogicLesson /></PrivateRoute>} />
            <Route path="/logica" element={<PrivateRoute><TruthTable /></PrivateRoute>} />
            <Route path="/juegos" element={<PrivateRoute><LogicGames /></PrivateRoute>} />
            <Route path="/conjuntos" element={<PrivateRoute><SetTheoryLab /></PrivateRoute>} />
            <Route path="/predicados" element={<PrivateRoute><PredicateLogicLesson /></PrivateRoute>} />
            <Route path="/inferencia" element={<PrivateRoute><InferenceLogic /></PrivateRoute>} />
            <Route path="/boole" element={<PrivateRoute><BooleanAlgebra /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
