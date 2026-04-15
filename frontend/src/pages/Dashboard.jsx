// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
    Table2, Brain, ChevronRight, BookOpen, Target, 
    Binary, Layers, GitBranch, GraduationCap, Sparkles,
    Play, Layout, Cpu, BrainCircuit
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const MODULES = [
    {
        id: 'u1',
        unit: 'Unidad 1',
        title: 'Lógica Proposicional',
        desc: 'Domina las tablas de verdad, conectivos lógicos y leyes del razonamiento formal.',
        icon: Table2,
        path: '/leccion',
        color: '#2563eb',
        type: 'TEORÍA',
        action: 'Comenzar Sesión'
    },
    {
        id: 'u2',
        unit: 'Unidad 2',
        title: 'Inferencia y Demostración',
        desc: 'Aplica reglas de inferencia y métodos de demostración para validar razonamientos.',
        icon: Brain,
        path: '/inferencia',
        color: '#8b5cf6',
        type: 'DEMOSTRACIÓN',
        action: 'Ver Reglas'
    },
    {
        id: 'lab',
        unit: 'Práctica',
        title: 'Laboratorio de Retos',
        desc: 'Pon a prueba tu agilidad mental con trivias, acertijos y paradojas interactivas.',
        icon: Target,
        path: '/juegos',
        color: '#06b6d4',
        type: 'PRÁCTICA',
        action: 'Entrar al Lab'
    },
    {
        id: 'u3',
        unit: 'Unidad 3',
        title: 'Lógica de Predicados',
        desc: 'Explora el análisis profundo de sujetos y propiedades con cuantificadores universales.',
        icon: GitBranch,
        path: '/predicados',
        color: '#f43f5e',
        type: 'TEORÍA',
        action: 'Cerrar Brecha'
    },
    {
        id: 'u4',
        unit: 'Unidad 4',
        title: 'Teoría de Conjuntos',
        desc: 'Fundamentos de agrupación de datos, diagramas de Venn y relaciones lógicas.',
        icon: Layers,
        path: '/conjuntos',
        color: '#f59e0b',
        type: 'TEORÍA',
        action: 'Explorar'
    },
    {
        id: 'u5',
        unit: 'Unidad 5',
        title: 'Álgebra de Boole',
        desc: 'Simplificación de funciones, compuertas lógicas y optimización de circuitos binarios.',
        icon: Binary,
        path: '/boole',
        color: '#10b981',
        type: 'SIMULADOR',
        action: 'Abrir Simulador'
    }
];

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container container fade-in">
            {/* Header del Dashboard - RESPONSIVE */}
            <header className="dashboard-header">
                <div className="dashboard-header-left">
                    <div className="dashboard-icon">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <p className="dashboard-welcome">
                            Bienvenido, <span className="dashboard-user">{user?.nombres || 'Agente'}</span>.
                        </p>
                    </div>
                </div>
                <div className="dashboard-header-right">
                    <Badge variant="success" className="dashboard-badge">Estudiante Activo</Badge>
                </div>
            </header>

            {/* Sección de Módulos */}
            <div className="modules-section">
                <h2 className="modules-title">
                    Módulos de <span className="modules-highlight">Entrenamiento</span>
                </h2>

                <div className="modules-grid">
                    {MODULES.map((module, index) => (
                        <Link 
                            key={module.id} 
                            to={module.path} 
                            className="module-card-link staggered-item"
                            style={{ '--delay': `${index * 0.1}s` }}
                        >
                            <Card className="module-card glass-card">
                                {/* Header de la tarjeta */}
                                <div className="module-card-header">
                                    <div className="module-icon" style={{ background: `${module.color}15`, color: module.color }}>
                                        <module.icon size={24} />
                                    </div>
                                    <div className="module-type" style={{ background: `${module.color}08`, color: module.color, border: `1px solid ${module.color}20` }}>
                                        {module.type}
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="module-card-body">
                                    <h3 className="module-title">{module.title}</h3>
                                    <p className="module-description">{module.desc}</p>
                                </div>

                                {/* Botón acción */}
                                <div className="module-action" style={{ color: module.color }}>
                                    {module.action} <ChevronRight size={16} />
                                </div>

                                {/* Decoración de fondo */}
                                <div className="module-decoration" style={{ background: `${module.color}05` }}></div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;