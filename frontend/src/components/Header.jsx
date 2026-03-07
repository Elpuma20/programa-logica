import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Sun, Moon, Instagram, Twitter, Facebook, MessageCircle } from 'lucide-react';
import whatsappLogo from '../assets/whatsapp-logo.png';

const Header = ({ theme, toggleTheme }) => {
    const { user, logout, token } = useAuth();

    return (
        <header className="nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to={token ? "/dashboard" : "/"} className="logo">
                    Edu<span>Lógica</span>
                </Link>

                <div className="header-socials" style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '2px' }}>
                    {[
                        { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                        { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                        { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                        { Icon: MessageCircle, href: "https://wa.me/", label: "WhatsApp" }
                    ].map((social, i) => (
                        <a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--text-muted)',
                                transition: 'all var(--transition-fast)',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: 0.8
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--brand-indigo)';
                                e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.opacity = 0.8;
                            }}
                            title={social.label}
                            aria-label={social.label}
                        >
                            <social.Icon size={20} strokeWidth={2} />
                        </a>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                    onClick={toggleTheme}
                    className="btn-secondary"
                    style={{
                        width: 36, height: 36, padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%'
                    }}
                    title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {token ? (
                    <>
                        <Link to="/perfil" style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            paddingLeft: '0.5rem', paddingRight: '1rem',
                            borderLeft: '1px solid var(--border-default)',
                            borderRight: '1px solid var(--border-default)',
                            textDecoration: 'none',
                            transition: 'background var(--transition-fast)',
                            cursor: 'pointer'
                        }} className="profile-link">
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'var(--brand-indigo-soft)', color: 'var(--brand-indigo)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(79, 70, 229, 0.1)'
                            }}>
                                <User size={16} />
                            </div>
                            <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>
                                {user?.nombres} {user?.apellidos}
                            </span>
                        </Link>
                        <button onClick={logout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '6px 12px' }}>
                            <LogOut size={14} /> Salir
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: 'var(--text-xs)' }}>
                        Iniciar Sesión
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
