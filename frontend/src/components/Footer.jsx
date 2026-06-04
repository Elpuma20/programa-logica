import { Heart, Instagram, Facebook, BrainCircuit } from 'lucide-react';

const WhatsAppIcon = ({ size = 20, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const Footer = () => {
    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: WhatsAppIcon,
            url: 'https://wa.me/',
            color: '#25D366',
            hoverBg: 'rgba(37, 211, 102, 0.1)'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: 'https://www.instagram.com/aisunergoficial?igsh=c3dpbThkYTZ2ZHU2',
            color: '#E4405F',
            hoverBg: 'rgba(228, 64, 95, 0.1)'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: 'https://facebook.com/',
            color: '#1877F2',
            hoverBg: 'rgba(24, 119, 242, 0.1)'
        }
    ];

    return (
        <footer style={{
            marginTop: 'auto',
            padding: '4rem 2rem 2rem',
            background: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-default)',
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                            }}>
                                <BrainCircuit size={18} />
                            </div>
                            <div className="logo" style={{ fontSize: '1.25rem', fontWeight: 900 }}>
                                Edu<span className="text-gradient">Lógica</span>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px' }}>
                            Explora la frontera entre la lógica pura y el pensamiento computacional con nuestra plataforma de vanguardia.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Plataforma</h4>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Laboratorio</a>
                            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Teoría</a>
                            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Documentación</a>
                        </nav>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Síguenos</h4>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={social.name}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: social.hoverBg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: social.color,
                                        transition: 'all 0.3s ease',
                                        border: `1px solid ${social.color}22`,
                                        textDecoration: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = social.color;
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = `0 6px 20px ${social.color}40`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = social.hoverBg;
                                        e.currentTarget.style.color = social.color;
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                            Conéctate con nosotros en redes
                        </p>
                    </div>
                </div>

                <div className="footer-bottom-row" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-default)',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem'
                }}>
                    <div></div>
                    <div>
                        © {new Date().getFullYear()} EduLógica. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
