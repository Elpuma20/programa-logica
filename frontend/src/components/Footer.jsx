import { Heart, Github, Twitter, Linkedin, BrainCircuit } from 'lucide-react';

const Footer = () => {
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
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Comunidad</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Github size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                            <Twitter size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                            <Linkedin size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
