import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    User, LogOut, Sun, Moon, Instagram, Twitter, Facebook, 
    Shield, BrainCircuit, Menu, X, ChevronRight, LayoutDashboard, 
    Settings, LogIn, UserPlus 
} from 'lucide-react';
import Button from './ui/Button';

const Header = ({ theme, toggleTheme }) => {
    const { user, logout, token } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Efecto de scroll para el header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar menú al cambiar de ruta
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const authPaths = ['/login', '/register', '/', '/recuperar', '/reset-password-confirm'];
    const isAuthPage = authPaths.some(path => location.pathname.startsWith(path));

    if (isAuthPage && !token) {
        return null;
    }

    return (
        <>
            <div className="main-header-wrapper">
                <header className="site-navbar">
                    <div className="navbar-inner">
                        <Link to={token ? "/dashboard" : "/"} className="brand-logo">
                            <div className="logo-box">
                                <BrainCircuit size={20} />
                            </div>
                            <span className="logo-text">Edu<span className="text-gradient">Lógica</span></span>
                        </Link>


                        <div className="header-right-actions">
                            <button className="icon-action-btn" onClick={toggleTheme} aria-label="Cambiar tema">
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>

                            {token ? (
                                <div className="user-access-group">
                                    {(user?.rol === 'ADMIN' || user?.rol === 'DOCENTE') && (
                                        <Link to="/admin" className="admin-access-link">
                                            <Shield size={14} /> PANEL {user?.rol === 'DOCENTE' ? 'DOCENTE' : 'ADMIN'}
                                        </Link>
                                    )}
                                    
                                    <Link to="/perfil" className="user-profile-summary">
                                        <div className="user-avatar-mini">
                                            <User size={14} />
                                        </div>
                                        <div className="user-info-text">
                                            <span className="user-name-label">{user?.nombres?.split(' ')[0]}</span>
                                            <span className="user-role-label">{user?.rol}</span>
                                        </div>
                                    </Link>

                                    <button onClick={logout} className="logout-direct-btn" title="Cerrar Sesión">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="guest-access-group">
                                    <Link to="/login" className="login-link-btn">Ingresar</Link>
                                    <Link to="/register" className="register-link-btn">Registrarse</Link>
                                </div>
                            )}

                            <button className="mobile-toggle" onClick={toggleMenu}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </header>
            </div>


            {/* Mobile Drawer Overlay */}
            <div className={`mobile-drawer-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} />
            
            {/* Mobile Drawer Menu */}
            <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="logo-group">
                        <div className="logo-icon">
                            <BrainCircuit size={20} />
                        </div>
                        <span className="logo-text" style={{ fontSize: '1.2rem' }}>EduLógica</span>
                    </div>
                    <Button variant="ghost" onClick={toggleMenu} style={{ padding: '0.5rem' }}>
                        <X size={24} />
                    </Button>
                </div>

                <div className="drawer-content">
                    {token ? (
                        <>
                            <div className="drawer-user-section glass-card">
                                <div className="drawer-avatar">
                                    <User size={24} />
                                </div>
                                <div className="drawer-user-info">
                                    <h4>{user?.nombres}</h4>
                                    <span>{user?.correo}</span>
                                    <div className="drawer-role-badge technical-label">{user?.rol}</div>
                                </div>
                            </div>

                            <nav className="drawer-nav">
                                <Link to="/dashboard" className={`drawer-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                                    <LayoutDashboard size={20} /> Dashboard <ChevronRight size={16} className="ms-auto" />
                                </Link>
                                <Link to="/perfil" className={`drawer-link ${location.pathname === '/perfil' ? 'active' : ''}`}>
                                    <User size={20} /> Perfil <ChevronRight size={16} className="ms-auto" />
                                </Link>
                                {(user?.is_staff || user?.rol === 'ADMIN' || user?.rol === 'DOCENTE') && (
                                    <Link to="/admin" className={`drawer-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                                        <Shield size={20} /> Panel Administrativo <ChevronRight size={16} className="ms-auto" />
                                    </Link>
                                )}
                                <Link to="/configuracion" className={`drawer-link ${location.pathname === '/configuracion' ? 'active' : ''}`}>
                                    <Settings size={20} /> Configuración <ChevronRight size={16} className="ms-auto" />
                                </Link>
                            </nav>

                            <div className="drawer-footer">
                                <Button variant="outline" className="w-full logout-btn-mobile" onClick={logout}>
                                    <LogOut size={20} /> Cerrar Sesión
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="drawer-auth">
                            <h3>¡Bienvenido!</h3>
                            <p>Accede para continuar tu aprendizaje.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                <Link to="/login" className="w-full">
                                    <Button variant="secondary" className="w-full">
                                        <LogIn size={18} /> Iniciar Sesión
                                    </Button>
                                </Link>
                                <Link to="/register" className="w-full">
                                    <Button variant="primary" className="w-full">
                                        <UserPlus size={18} /> Registrarse
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
