import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Layout, LogOut, Table2, Brain, User } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container">
            <nav className="nav">
                <div className="logo" style={{ fontSize: '2rem' }}>Edu<span>Lógica</span></div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <User size={18} />
                        <span style={{ fontWeight: 500 }}>{user?.nombres} {user?.apellidos}</span>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            background: 'none',
                            border: '1px solid var(--border-dark)',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={18} /> Salir
                    </button>
                </div>
            </nav>

            <div className="page-header">
                <h1>Bienvenido, {user?.nombres}</h1>
                <p>Selecciona un módulo para comenzar a estudiar.</p>
            </div>

            <div className="feature-grid">
                <Link to="/leccion" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="module-card">
                        <div className="module-icon">
                            <Table2 size={24} />
                        </div>
                        <h3>Lógica Matemática</h3>
                        <p>Aprende y practica con tablas de verdad, operadores lógicos y resolución de proposiciones. Incluye ejercicios interactivos con retroalimentación inmediata.</p>
                    </div>
                </Link>

                <div className="module-card" style={{ opacity: 0.65, cursor: 'default' }}>
                    <div className="module-icon" style={{ background: '#e2e8f0' }}>
                        <Brain size={24} />
                    </div>
                    <h3>Próximamente</h3>
                    <p>Estamos desarrollando nuevos módulos de aprendizaje. ¡Mantente atento a las actualizaciones!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
