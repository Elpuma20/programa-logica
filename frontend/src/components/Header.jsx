import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Sun, Moon, Instagram, Twitter, Facebook, MessageCircle, Shield, BrainCircuit } from 'lucide-react';
import Button from './ui/Button';

const Header = ({ theme, toggleTheme }) => {
    const { user, logout, token } = useAuth();
    const location = useLocation();

    // Hide header on login and register pages
    if (['/login', '/register', '/'].includes(location.pathname)) {
        if (!token) return null;
    }

    return (
        <div className="nav-container fade-in">
            <header className="header">
                {/* Logo / Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to={token ? "/dashboard" : "/"} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.8rem', 
                        textDecoration: 'none' 
                    }}>
                        <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                        }}>
                            <BrainCircuit size={22} />
                        </div>
                        <span style={{ 
                            fontSize: '1.4rem', 
                            fontWeight: 900, 
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.04em'
                        }}>
                            Edu<span className="text-gradient">Lógica</span>
                        </span>
                    </Link>
                    
                    <div className="social-links" style={{ display: 'flex', gap: '1rem', marginLeft: '1.5rem', borderLeft: '1px solid var(--border-default)', paddingLeft: '1.5rem' }}>
                        <a href="#" className="social-icon"><Twitter size={18} /></a>
                        <a href="#" className="social-icon"><Instagram size={18} /></a>
                        <a href="#" className="social-icon"><Facebook size={18} /></a>
                    </div>
                </div>

                {/* Main Actions */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <Button 
                        variant="ghost" 
                        onClick={toggleTheme}
                        style={{ width: 42, height: 42, padding: 0, borderRadius: '12px' }}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </Button>

                    {token ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {user?.is_staff && (
                                <Link to="/admin" style={{ textDecoration: 'none' }}>
                                    <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800 }}>
                                        <Shield size={16} /> ADMIN
                                    </Button>
                                </Link>
                            )}
                            
                            <Link to="/perfil" className="glass-card" style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-default)',
                                transition: 'all 0.2s'
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '10px',
                                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', 
                                    color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                                }}>
                                    <User size={16} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '0.85rem' }}>
                                        {user?.nombres?.split(' ')[0] || 'Usuario'}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 600 }}>Estudiante</span>
                                </div>
                            </Link>

                            <Button variant="ghost" onClick={logout} style={{ padding: '0.5rem' }}>
                                <LogOut size={20} />
                            </Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="secondary" style={{ padding: '0.6rem 1.25rem' }}>Acceder</Button>
                            </Link>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <Button variant="primary" style={{ padding: '0.6rem 1.5rem', boxShadow: '0 8px 20px -6px var(--brand-glow)' }}>Registro</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;
