import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, Table2, Brain, User, Terminal } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container">
            <div className="page-header animate-fade-up" style={{
                marginBottom: '3rem',
                marginTop: '1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '2rem'
            }}>
                <h1 style={{ fontSize: 'var(--text-3xl)', letterSpacing: '-0.04em', color: 'var(--brand-navy)' }}>Panel de Control</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-md)', marginTop: '0.25rem' }}>
                    Bienvenido, <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user?.nombres}</span>. Continúa con tu progreso de aprendizaje.
                </p>
            </div>

            <div className="feature-grid">
                <Link to="/leccion" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="module-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div className="module-icon">
                                <Table2 size={24} strokeWidth={2.5} />
                            </div>
                            <span className="badge badge-indigo">Módulo Activo</span>
                        </div>
                        <div>
                            <h3 style={{ fontWeight: '700', fontSize: 'var(--text-lg)', marginBottom: '0.5rem' }}>Lógica Matemática</h3>
                            <p style={{ lineHeight: '1.6' }}>Dominio de proposiciones binarias y conectivos lógicos fundamentales para el razonamiento computacional.</p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-indigo)', fontWeight: '600', fontSize: 'var(--text-sm)' }}>
                            Empezar ahora <Terminal size={14} />
                        </div>
                    </div>
                </Link>

                <div className="module-card" style={{ opacity: 0.8, cursor: 'default', background: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div className="module-icon" style={{ opacity: 0.5 }}>
                            <Brain size={24} strokeWidth={2.5} />
                        </div>
                        <span className="badge" style={{ background: '#E2E8F0', color: '#475569' }}>Próximamente</span>
                    </div>
                    <div>
                        <h3 style={{ fontWeight: '700', fontSize: 'var(--text-lg)', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Sistemas Expertos</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Introducción avanzada a la inferencia lógica y representación del conocimiento en sistemas inteligentes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
