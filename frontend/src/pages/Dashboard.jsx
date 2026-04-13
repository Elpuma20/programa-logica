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
        color: '#2563eb', // Blue
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
        color: '#8b5cf6', // Purple
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
        color: '#06b6d4', // Cyan
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
        color: '#f43f5e', // Rose
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
        color: '#f59e0b', // Amber
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
        color: '#10b981', // Green
        type: 'SIMULADOR',
        action: 'Abrir Simulador'
    }
];

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container fade-in">
            {/* Header section */}
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}>
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
                            Bienvenido, <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{user?.nombres || 'Agente'}</span>.
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                     <Badge variant="success" style={{ padding: '0.5rem 1rem' }}>Estudiante Activo</Badge>
                </div>
            </header>

            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    Módulos de <span style={{ color: 'var(--brand-secondary)' }}>Entrenamiento</span>
                </h2>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '2rem' 
                }}>
                    {MODULES.map((module, index) => (
                        <Link 
                            key={module.id} 
                            to={module.path} 
                            className="staggered-item"
                            style={{ 
                                textDecoration: 'none', 
                                color: 'inherit',
                                '--delay': `${index * 0.1}s`
                            }}
                        >
                            <Card className="glass-card" style={{ 
                                height: '100%', 
                                padding: '2rem', 
                                display: 'flex', 
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Header: Icon + Badge */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div style={{ 
                                        width: 48, 
                                        height: 48, 
                                        borderRadius: '12px', 
                                        background: `${module.color}15`, 
                                        color: module.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <module.icon size={24} />
                                    </div>
                                    <div style={{ 
                                        padding: '0.4rem 0.8rem', 
                                        borderRadius: '20px', 
                                        background: `${module.color}08`, 
                                        color: module.color,
                                        fontSize: '0.65rem',
                                        fontWeight: 900,
                                        letterSpacing: '0.05em',
                                        border: `1px solid ${module.color}20`
                                    }}>
                                        {module.type}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 800 }}>{module.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                                        {module.desc}
                                    </p>
                                </div>

                                {/* Footer Action */}
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem', 
                                    color: module.color,
                                    fontWeight: 800,
                                    fontSize: '0.9rem'
                                }}>
                                    {module.action} <ChevronRight size={16} />
                                </div>

                                {/* Decorative Element (Subtle background circle as seen in image) */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    width: 100,
                                    height: 100,
                                    background: `${module.color}05`,
                                    borderRadius: '50%',
                                    zIndex: 0
                                }}></div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;

