import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            marginTop: 'auto',
            padding: '3rem 2rem',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-default)',
            textAlign: 'center'
        }}>
            <div className="container" style={{ padding: 0 }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.25rem'
                }}>
                    <div className="logo" style={{ fontSize: '1.1rem' }}>
                        Edu<span>Lógica</span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', maxWidth: '400px', lineHeight: '1.6' }}>
                        Plataforma de alto rendimiento para el aprendizaje de lógica matemática y razonamiento computacional.
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: 'var(--text-muted)',
                        fontSize: 'var(--text-xs)',
                        marginTop: '0.5rem',
                        opacity: 0.8
                    }}>
                        Hecho con <Heart size={12} style={{ color: 'var(--semantic-error)' }} /> para estudiantes de hoy.
                        <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>|</span>
                        © {new Date().getFullYear()} EduLógica
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
