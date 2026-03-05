import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Table2, UserPlus, LogIn } from 'lucide-react';

const Welcome = () => {
    return (
        <div className="container">
            <div className="welcome-header">
                <h1>Academia Virtual</h1>
                <p>Plataforma educativa para el aprendizaje interactivo de Lógica Matemática. Desarrolla tu pensamiento crítico con ejercicios prácticos.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <div className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.25rem' }}>
                        <LogIn size={20} /> Iniciar Sesión
                    </div>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <div className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.25rem' }}>
                        <UserPlus size={20} /> Registrarse
                    </div>
                </Link>
            </div>

            <div className="feature-grid" style={{ marginTop: '4rem' }}>
                <div className="feature-card">
                    <div className="module-icon">
                        <BookOpen size={24} />
                    </div>
                    <h3>Material Teórico</h3>
                    <p>Accede a contenido académico estructurado sobre lógica proposicional y tablas de verdad.</p>
                </div>
                <div className="feature-card">
                    <div className="module-icon">
                        <Table2 size={24} />
                    </div>
                    <h3>Ejercicios Prácticos</h3>
                    <p>Practica con ejercicios interactivos y recibe retroalimentación inmediata sobre tu desempeño.</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
