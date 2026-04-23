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
            <div className={`nav-container ${scrolled ? 'nav-scrolled' : ''} fade-in`}>
                <header className="header glass-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* Logo */}
                        <Link to={token ? "/dashboard" : "/"} className="logo-group">
                            <div className="logo-icon">
                                <BrainCircuit size={22} />
                            </div>
                            <span className="logo-text">
                                Edu<span className="text-gradient">Lógica</span>
                            </span>
                        </Link>
                        
                        {/* Redes - Ocultas en móvil */}
                        <div className="social-links hide-mobile">
                            <a href="#" className="social-icon"><Twitter size={18} /></a>
                            <a href="#" className="social-icon"><Instagram size={18} /></a>
                            <a href="#" className="social-icon"><Facebook size={18} /></a>
                        </div>
                    </div>

                    {/* Desktop Menu & Controls */}
                    <div className="header-actions">
                        <Button 
                            variant="ghost" 
                            onClick={toggleTheme}
                            className="theme-toggle-btn"
                            aria-label="Cambiar tema"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </Button>

                        {token ? (
                            <div className="desktop-nav-group hide-mobile">
                                {(user?.is_staff || user?.rol === 'ADMIN' || user?.rol === 'DOCENTE') && (
                                    <Link to="/admin" style={{ textDecoration: 'none' }}>
                                        <Button variant="secondary" className="admin-btn">
                                            <Shield size={16} /> PANEL {user?.rol === 'DOCENTE' ? 'DOCENTE' : 'ADMIN'}
                                        </Button>
                                    </Link>
                                )}
                                
                                <Link to="/perfil" className="profile-pill glass-card">
                                    <div className="profile-avatar">
                                        <User size={16} />
                                    </div>
                                    <div className="profile-info">
                                        <span className="profile-name">{user?.nombres?.split(' ')[0] || 'Usuario'}</span>
                                        <span className="profile-role">{user?.rol || 'Estudiante'}</span>
                                    </div>
                                </Link>

                                <Button variant="ghost" onClick={logout} className="logout-btn">
                                    <LogOut size={20} />
                                </Button>
                            </div>
                        ) : (
                            <div className="desktop-auth-group hide-mobile">
                                <Link to="/login" style={{ textDecoration: 'none' }}>
                                    <Button variant="secondary">Acceder</Button>
                                </Link>
                                <Link to="/register" style={{ textDecoration: 'none' }}>
                                    <Button variant="primary">Registro</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button 
                            variant="ghost" 
                            onClick={toggleMenu} 
                            className="mobile-menu-trigger show-mobile"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
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
