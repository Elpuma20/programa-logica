// src/components/Footer.jsx
import React, { useState } from 'react';
import { Instagram, Facebook, BrainCircuit } from 'lucide-react';

const WhatsAppIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const Footer = () => {
    const [hoveredSocial, setHoveredSocial] = useState(null);

    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: WhatsAppIcon,
            url: 'https://wa.me/',
            color: '#25D366',
            bgColor: 'rgba(37, 211, 102, 0.06)',
            borderColor: 'rgba(37, 211, 102, 0.25)',
            hoverBg: 'rgba(37, 211, 102, 0.15)'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: 'https://www.instagram.com/aisunergoficial?igsh=c3dpbThkYTZ2ZHU2',
            color: '#E4405F',
            bgColor: 'rgba(228, 64, 95, 0.06)',
            borderColor: 'rgba(228, 64, 95, 0.25)',
            hoverBg: 'rgba(228, 64, 95, 0.15)'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: 'https://facebook.com/',
            color: '#1877F2',
            bgColor: 'rgba(24, 119, 242, 0.06)',
            borderColor: 'rgba(24, 119, 242, 0.25)',
            hoverBg: 'rgba(24, 119, 242, 0.15)'
        }
    ];

    return (
        <footer style={{
            marginTop: 'auto',
            padding: '3rem 2rem 2rem',
            background: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-default)',
            width: '100%'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Fila Principal */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Sección Izquierda: Logo y Menú */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #1d56d8, #0ea5e9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 4px 14px rgba(29, 86, 216, 0.25)'
                            }}>
                                <BrainCircuit size={20} />
                            </div>
                            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                Edu<span className="text-gradient">Lógica</span>
                            </span>
                        </div>
                        {/* Menú Horizontal */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            fontSize: '0.95rem', 
                            color: 'var(--text-secondary)',
                            fontWeight: 500
                        }}>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Laboratorio</a>
                            <span>•</span>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Teoría</a>
                            <span>•</span>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Documentación</a>
                        </div>
                    </div>

                    {/* Sección Derecha: Redes Sociales */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={social.name}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: hoveredSocial === social.name ? social.hoverBg : social.bgColor,
                                    border: `1px solid ${hoveredSocial === social.name ? social.color : social.borderColor}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: social.color,
                                    transition: 'all 0.2s ease',
                                    transform: hoveredSocial === social.name ? 'translateY(-2px)' : 'none',
                                    boxShadow: hoveredSocial === social.name ? `0 6px 15px -4px ${social.color}25` : 'none',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={() => setHoveredSocial(social.name)}
                                onMouseLeave={() => setHoveredSocial(null)}
                            >
                                <social.icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Línea Divisoria y Copyright */}
                <div style={{
                    borderTop: '1px solid var(--border-default)',
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                }}>
                    <div>
                        © {new Date().getFullYear()} EduLógica. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
