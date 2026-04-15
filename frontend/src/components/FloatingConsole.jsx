import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Gamepad2, User, Settings, 
  Shield, LogOut, X, Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FloatingConsole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { token, user, logout } = useAuth();

  if (!token) return null;

  const toggleConsole = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/juegos', label: 'Retos', icon: Gamepad2 },
    { path: '/perfil', label: 'Perfil', icon: User },
    // Only show admin if user is staff/admin
    ...(user?.rol === 'ADMIN' || user?.rol === 'DOCENTE' ? [{ path: '/admin', label: 'Admin', icon: Shield }] : []),
    { path: '/configuracion', label: 'Config', icon: Settings },
  ];

  return (
    <>
      {/* Floating Button (FAB) */}
      <div 
        className={`console-fab hide-desktop ${isOpen ? 'active' : ''}`}
        onClick={toggleConsole}
      >
        {isOpen ? <X size={28} /> : <Terminal size={28} />}
      </div>

      {/* Fullscreen Blurred Overlay */}
      <div className={`console-overlay ${isOpen ? 'open' : ''}`} onClick={toggleConsole}>
        <div className="console-grid" onClick={(e) => e.stopPropagation()}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className="console-item"
                onClick={() => setIsOpen(false)}
              >
                <Icon size={32} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{item.label}</span>
                {isActive && (
                  <div style={{ 
                    position: 'absolute', top: 10, right: 10, 
                    width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-secondary)' 
                  }} />
                )}
              </Link>
            );
          })}
          
          <div className="console-item" onClick={logout} style={{ gridColumn: 'span 2', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <LogOut size={24} color="#ef4444" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444' }}>Cerrar Sesión</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingConsole;
