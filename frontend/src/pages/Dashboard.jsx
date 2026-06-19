// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
    Table2, Brain, ChevronRight, BookOpen, Target, 
    Binary, Layers, GitBranch, GraduationCap, Sparkles,
    Play, Layout, Cpu, BrainCircuit, Activity, ClipboardCheck,
    Video, FileText, ExternalLink, HelpCircle, Info, Users,
    Shield, Clock, Calendar, CheckCircle2, TrendingUp, Award,
    CheckCircle, ShieldAlert, ArrowRight, Database
} from 'lucide-react';

import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const KNOWLEDGE_MODULES = [
    {
        id: 'u1',
        title: 'Lógica Proposicional',
        desc: 'Domina las tablas de verdad, conectivos lógicos y leyes del razonamiento formal.',
        icon: Table2,
        path: '/leccion',
        color: '#3b82f6', // Bright Blue
        type: 'TEORÍA Y SIMULACIÓN',
        action: 'Comenzar Lección'
    },
    {
        id: 'u2',
        title: 'Inferencia y Demostración',
        desc: 'Aplica reglas de inferencia y métodos de demostración para validar razonamientos.',
        icon: Brain,
        path: '/inferencia',
        color: '#8b5cf6', // Violet
        type: 'DEMOSTRACIÓN DEDUCTIVA',
        action: 'Ver Reglas'
    },
    {
        id: 'u3',
        title: 'Lógica de Predicados',
        desc: 'Explora el análisis profundo de sujetos y propiedades con cuantificadores universales.',
        icon: GitBranch,
        path: '/predicados',
        color: '#ec4899', // Pink
        type: 'TEORÍA AVANZADA',
        action: 'Estudiar Cuantificadores'
    },
    {
        id: 'u4',
        title: 'Teoría de Conjuntos',
        desc: 'Fundamentos de agrupación de datos, diagramas de Venn y relaciones lógicas.',
        icon: Layers,
        path: '/conjuntos',
        color: '#06b6d4', // Cyan
        type: 'TEORÍA Y PROPIEDADES',
        action: 'Explorar Conjuntos'
    },
    {
        id: 'u5',
        title: 'Álgebra de Boole',
        desc: 'Simplificación de funciones, compuertas lógicas y optimización de circuitos binarios.',
        icon: Binary,
        path: '/boole',
        color: '#10b981', // Emerald
        type: 'SIMULADOR DE COMPUERTAS',
        action: 'Abrir Simulador'
    }
];

const HELP_LINKS = [
    {
        title: "Guía de Estudio: Conectores y Tablas de Verdad",
        desc: "Documentación completa con ejemplos prácticos de contingencias, tautologías y contradicciones.",
        type: "PDF",
        url: "https://www.youtube.com/results?search_query=tablas+de+verdad+logica+matematica",
        icon: FileText,
        badgeColor: "rgba(59, 130, 246, 0.1)",
        textColor: "#3b82f6"
    },
    {
        title: "Video Tutorial: Métodos de Demostración Formal",
        desc: "Video explicativo sobre Modus Ponens, Modus Tollens y Silogismo Disyuntivo aplicado a sistemas.",
        type: "VIDEO",
        url: "https://www.youtube.com/results?search_query=reglas+de+inferencia+logica+matematica",
        icon: Video,
        badgeColor: "rgba(139, 92, 246, 0.1)",
        textColor: "#8b5cf6"
    },
    {
        title: "Material de Apoyo: Compuertas Lógicas y Circuitos",
        desc: "Guía de referencia rápida sobre operaciones AND, OR, NOT y simplificación de circuitos.",
        type: "DOCS",
        url: "https://www.youtube.com/results?search_query=algebra+de+boole+compuertas+logicas",
        icon: ExternalLink,
        badgeColor: "rgba(16, 185, 129, 0.1)",
        textColor: "#10b981"
    }
];

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Estados para Estudiantes
    const [resolutions, setResolutions] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [evalResults, setEvalResults] = useState([]);
    const [totalContents, setTotalContents] = useState([]);

    // Estados para Admins / Docentes
    const [adminStats, setAdminStats] = useState(null);
    const [usersCount, setUsersCount] = useState(0);

    // Hover states for dynamic interactions
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                if (user.rol === 'ESTUDIANTE') {
                    const [resHist, resEval, resMisEval, resCont] = await Promise.all([
                        api.get('/logica/historial/').catch(() => ({ data: [] })),
                        api.get('/logica/evaluaciones/').catch(() => ({ data: [] })),
                        api.get('/logica/mis-evaluaciones/').catch(() => ({ data: [] })),
                        api.get('/logica/contenido/').catch(() => ({ data: [] }))
                    ]);
                    setResolutions(resHist.data || []);
                    setEvaluations(resEval.data || []);
                    setEvalResults(resMisEval.data || []);
                    setTotalContents(resCont.data || []);
                } else {
                    const [resStats, resCont, resEvalAdmin] = await Promise.all([
                        api.get('/admin/stats/').catch(() => ({ data: null })),
                        api.get('/logica/contenido/').catch(() => ({ data: [] })),
                        api.get('/logica/evaluaciones-admin/').catch(() => ({ data: [] }))
                    ]);
                    setAdminStats(resStats.data);
                    setTotalContents(resCont.data || []);
                    setEvaluations(resEvalAdmin.data || []);

                    if (user.rol === 'ADMIN' || user.is_staff) {
                        const resUsers = await api.get('/list/').catch(() => ({ data: [] }));
                        setUsersCount(resUsers.data?.length || 0);
                    }
                }
            } catch (err) {
                console.error("Error al cargar datos del dashboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    const getCargo = (rol) => {
        if (rol === 'ADMIN') return 'Coordinador de Lógica Matemática';
        if (rol === 'DOCENTE') return 'Docente de Lógica Matemática';
        return 'Estudiante de Ingeniería en Sistemas';
    };

    const getFechaActual = () => {
        return new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                <BrainCircuit size={64} className="spin" style={{ color: 'var(--brand-primary)', marginBottom: '2rem' }} />
                <h2 className="pulse" style={{ fontWeight: 800 }}>Cargando portal académico...</h2>
            </div>
        );
    }

    // --- RENDER DASHBOARD ESTUDIANTE ---
    const renderStudentDashboard = () => {
        const completedChallenges = resolutions.length;
        const totalActiveChallenges = totalContents.length || 1;
        const progressPercentage = Math.round((completedChallenges / totalActiveChallenges) * 100);

        const avgScore = evalResults.length > 0
            ? Math.round(evalResults.reduce((acc, curr) => acc + parseFloat(curr.porcentaje || 0), 0) / evalResults.length)
            : 0;

        const totalStudyTime = Math.round(resolutions.reduce((acc, curr) => acc + parseInt(curr.tiempo_usado || 0, 10), 0) / 60);

        const completedEvalIds = evalResults.map(r => r.evaluacion);
        const pendingEvals = evaluations.filter(e => !completedEvalIds.includes(e.id));

        return (
            <div className="fade-in">
                {/* 1. MÉTTRICAS ACADÉMICAS (BENTO STYLE) */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                    gap: '1.5rem', 
                    marginBottom: '3rem' 
                }}>
                    <Card style={{ 
                        padding: '1.75rem', 
                        border: '1px solid var(--border-default)', 
                        borderRadius: '20px', 
                        boxShadow: 'var(--shadow-md)', 
                        background: 'var(--bg-surface)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Progreso General</span>
                            <div style={{ padding: '0.45rem', background: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6', borderRadius: '10px' }}>
                                <Award size={18} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>{progressPercentage}%</h2>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                            {completedChallenges} de {totalActiveChallenges} desafíos completados
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: '4px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </div>
                    </Card>

                    <Card style={{ 
                        padding: '1.75rem', 
                        border: '1px solid var(--border-default)', 
                        borderRadius: '20px', 
                        boxShadow: 'var(--shadow-md)', 
                        background: 'var(--bg-surface)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Promedio Global</span>
                            <div style={{ padding: '0.45rem', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', borderRadius: '10px' }}>
                                <TrendingUp size={18} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>{avgScore}%</h2>
                        <div style={{ marginTop: '0.75rem' }}>
                            <Badge variant={avgScore >= 60 ? 'success' : 'danger'} style={{ fontSize: '0.7rem', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
                                {avgScore >= 60 ? '✓ CONDICIÓN: APROBANDO' : '✗ REQUIERE ATENCIÓN'}
                            </Badge>
                        </div>
                    </Card>

                    <Card style={{ 
                        padding: '1.75rem', 
                        border: '1px solid var(--border-default)', 
                        borderRadius: '20px', 
                        boxShadow: 'var(--shadow-md)', 
                        background: 'var(--bg-surface)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Evaluaciones</span>
                            <div style={{ padding: '0.45rem', background: 'rgba(6, 182, 212, 0.08)', color: '#06b6d4', borderRadius: '10px' }}>
                                <CheckCircle size={18} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>{evalResults.length}</h2>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            Completadas de {evaluations.length} disponibles
                        </div>
                    </Card>

                    <Card style={{ 
                        padding: '1.75rem', 
                        border: '1px solid var(--border-default)', 
                        borderRadius: '20px', 
                        boxShadow: 'var(--shadow-md)', 
                        background: 'var(--bg-surface)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Tiempo de Estudio</span>
                            <div style={{ padding: '0.45rem', background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', borderRadius: '10px' }}>
                                <Clock size={18} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                            {totalStudyTime} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>min</span>
                        </h2>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            Invertidos en resolución de retos
                        </div>
                    </Card>
                </div>

                {/* 2. AREA DE CONTENIDO PRINCIPAL */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1.7fr 1.3fr', 
                    gap: '2.5rem', 
                    alignItems: 'start' 
                }} className="dashboard-main-grid-responsive">
                    
                    {/* COLUMNA IZQUIERDA: MÓDULOS EN CUADRÍCULA (GRID) */}
                    <section className="modules-section">
                        <div style={{ marginBottom: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={22} style={{ color: 'var(--brand-primary)' }} />
                                Módulos Temáticos de Aprendizaje
                            </h2>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                Desarrolla los fundamentos teóricos y simula problemas matemáticos complejos.
                            </p>
                        </div>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                            gap: '1.25rem' 
                        }}>
                            {KNOWLEDGE_MODULES.map((module) => (
                                <Link 
                                    key={module.id} 
                                    to={module.path} 
                                    style={{ textDecoration: 'none' }}
                                    onMouseEnter={() => setHoveredCard(module.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Card style={{ 
                                        padding: '1.5rem', 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'space-between',
                                        borderRadius: '16px',
                                        border: hoveredCard === module.id ? `1px solid ${module.color}` : '1px solid var(--border-default)',
                                        boxShadow: hoveredCard === module.id ? '0 10px 25px -5px rgba(0, 0, 0, 0.05), var(--shadow-glow)' : 'var(--shadow-sm)',
                                        transform: hoveredCard === module.id ? 'translateY(-4px)' : 'none',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: 'var(--bg-surface)'
                                    }}>
                                        <div>
                                            <div style={{ 
                                                width: '44px', 
                                                height: '44px', 
                                                borderRadius: '10px', 
                                                background: `${module.color}12`, 
                                                color: module.color, 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                marginBottom: '1.25rem' 
                                            }}>
                                                <module.icon size={20} />
                                            </div>
                                            <span style={{ fontSize: '0.625rem', fontWeight: 900, color: module.color, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                                                {module.type}
                                            </span>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                                {module.title}
                                            </h3>
                                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                                                {module.desc}
                                            </p>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '4px', 
                                            fontSize: '0.78rem', 
                                            fontWeight: 800, 
                                            color: module.color, 
                                            marginTop: '1.5rem', 
                                            borderTop: '1px solid var(--border-default)', 
                                            paddingTop: '0.75rem' 
                                        }}>
                                            <span>{module.action}</span>
                                            <ChevronRight size={14} style={{ 
                                                transform: hoveredCard === module.id ? 'translateX(3px)' : 'none',
                                                transition: 'transform 0.2s' 
                                            }} />
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* COLUMNA DERECHA: EVALUACIONES Y RETOS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* SECCIÓN JUEGOS / RETOS */}
                        <section>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Target size={20} style={{ color: '#f59e0b' }} />
                                    Validación de Conocimientos
                                </h2>
                            </div>
                            
                            <Link to="/juegos" style={{ textDecoration: 'none' }}
                                  onMouseEnter={() => setHoveredCard('juegos')}
                                  onMouseLeave={() => setHoveredCard(null)}>
                                <Card style={{ 
                                    padding: '1.5rem', 
                                    borderRadius: '16px', 
                                    border: hoveredCard === 'juegos' ? '1px solid #f59e0b' : '1px solid var(--border-default)',
                                    boxShadow: hoveredCard === 'juegos' ? '0 10px 25px -5px rgba(245, 158, 11, 0.1)' : 'var(--shadow-sm)',
                                    transform: hoveredCard === 'juegos' ? 'translateY(-3px)' : 'none',
                                    transition: 'all 0.25s ease',
                                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.04) 0%, var(--bg-surface) 100%)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <div style={{ padding: '0.45rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '8px' }}>
                                            <Target size={18} />
                                        </div>
                                        <span style={{ fontSize: '0.625rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '1px' }}>JUEGO Y VALIDACIÓN</span>
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Laboratorio de Retos Lógicos</h3>
                                    <p style={{ margin: '0.5rem 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                                        Practica lógica matemática mediante rompecabezas interactivos, adivinanzas, paradojas y trivias estructuradas.
                                    </p>
                                    <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                                        <span>Ingresar al Laboratorio</span>
                                        <ChevronRight size={14} style={{ marginLeft: '2px', transform: hoveredCard === 'juegos' ? 'translateX(3px)' : 'none', transition: 'transform 0.2s' }} />
                                    </div>
                                </Card>
                            </Link>
                        </section>

                        {/* SECCIÓN EVALUACIONES PENDIENTES */}
                        <section>
                            <Card style={{ 
                                padding: '1.5rem', 
                                borderRadius: '16px', 
                                border: '1px solid var(--border-default)',
                                boxShadow: 'var(--shadow-sm)',
                                background: 'var(--bg-surface)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <ClipboardCheck size={20} style={{ color: '#ef4444' }} />
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Evaluaciones Asignadas</h3>
                                    </div>
                                    <Badge variant="danger" style={{ fontSize: '0.65rem' }}>
                                        {pendingEvals.length} PENDIENTES
                                    </Badge>
                                </div>
                                
                                {pendingEvals.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {pendingEvals.slice(0, 3).map(ev => (
                                            <div key={ev.id} style={{ 
                                                background: 'var(--bg-secondary)', 
                                                padding: '0.85rem 1rem', 
                                                borderRadius: '12px', 
                                                border: '1px solid var(--border-default)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'border-color 0.2s'
                                            }}>
                                                <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{ev.titulo}</div>
                                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.25rem', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                                                        {ev.tipo_logica} // UMBRAL: {ev.umbral_aprobacion}%
                                                    </div>
                                                </div>
                                                <Link to="/evaluaciones" style={{ textDecoration: 'none' }}>
                                                    <Button size="sm" style={{ 
                                                        padding: '0.35rem 0.8rem', 
                                                        fontSize: '0.7rem',
                                                        borderRadius: '8px',
                                                        fontWeight: 700,
                                                        background: 'var(--brand-primary)',
                                                        boxShadow: 'none'
                                                    }}>Comenzar</Button>
                                                </Link>
                                            </div>
                                        ))}
                                        {pendingEvals.length > 3 && (
                                            <Link to="/evaluaciones" style={{ 
                                                textDecoration: 'none', 
                                                fontSize: '0.78rem', 
                                                fontWeight: 800, 
                                                color: 'var(--brand-primary)', 
                                                textAlign: 'center', 
                                                marginTop: '0.5rem', 
                                                display: 'block' 
                                            }}>
                                                Ver {pendingEvals.length - 3} evaluaciones más <ChevronRight size={12} />
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ 
                                        background: 'rgba(16, 185, 129, 0.04)', 
                                        border: '1px solid rgba(16, 185, 129, 0.15)', 
                                        padding: '1rem', 
                                        borderRadius: '12px', 
                                        display: 'flex', 
                                        gap: '0.6rem', 
                                        alignItems: 'center' 
                                    }}>
                                        <CheckCircle size={18} style={{ color: '#10b981' }} />
                                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>¡Estás al día! Completaste todos tus exámenes asignados.</span>
                                    </div>
                                )}
                            </Card>
                        </section>

                        {/* RECURSOS Y GUÍAS (HUB DE RECURSOS) */}
                        <section>
                            <Card style={{ 
                                padding: '1.5rem', 
                                borderRadius: '16px', 
                                border: '1px solid var(--border-default)', 
                                boxShadow: 'var(--shadow-sm)',
                                background: 'var(--bg-surface)' 
                            }}>
                                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BookOpen size={20} style={{ color: 'var(--brand-secondary)' }} />
                                    Material y Recursos de Apoyo
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {HELP_LINKS.map((link, idx) => (
                                        <a 
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ 
                                                textDecoration: 'none', 
                                                display: 'flex', 
                                                gap: '0.85rem', 
                                                alignItems: 'flex-start',
                                                padding: '0.85rem',
                                                borderRadius: '12px',
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-default)',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={() => setHoveredCard(`help-${idx}`)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            className="support-resource-item"
                                        >
                                            <div style={{ 
                                                padding: '0.45rem', 
                                                background: link.badgeColor, 
                                                color: link.textColor, 
                                                borderRadius: '8px', 
                                                marginTop: '2px' 
                                            }}>
                                                <link.icon size={16} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ 
                                                    margin: 0, 
                                                    fontSize: '0.85rem', 
                                                    fontWeight: 700, 
                                                    color: hoveredCard === `help-${idx}` ? 'var(--brand-primary)' : 'var(--text-primary)', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '4px',
                                                    transition: 'color 0.2s'
                                                }}>
                                                    {link.title} <ExternalLink size={10} style={{ opacity: 0.5 }} />
                                                </h4>
                                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                                    {link.desc}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDER DASHBOARD ADMIN / DOCENTE ---
    const renderAdminDashboard = () => {
        const totalUsers = adminStats?.total_users || usersCount || 0;
        const totalResolutions = adminStats?.total_resolutions || 0;
        const totalChallenges = adminStats?.total_contents || totalContents.length || 0;
        const totalActiveEvaluations = evaluations.length || 0;

        const bentoItems = [
            {
                title: "Monitoreo Académico de Estudiantes",
                desc: "Inspecciona el progreso estudiantil por sección, estadísticas de error y exporta reportes de rendimiento cognitivo.",
                icon: Activity,
                color: "var(--brand-primary)",
                tab: "progreso"
            },
            {
                title: "Gestión de Evaluaciones Académicas",
                desc: "Crea y configura exámenes de nivelación no ponderados. Habilita o deshabilita accesos y ajusta umbrales.",
                icon: ClipboardCheck,
                color: "#ef4444",
                tab: "evaluaciones"
            },
            {
                title: "Repositorio de Desafíos Lógicos",
                desc: "Inyecta y edita rompecabezas visuales, trivias con opciones, adivinanzas o paradojas teóricas.",
                icon: Database,
                color: "#f59e0b",
                tab: "trivia"
            },
            {
                title: "Control de Cuentas y Agentes",
                desc: "Directorio institucional de estudiantes y profesores. Habilita perfiles y blinda accesos del sistema.",
                icon: Users,
                color: "#10b981",
                tab: "usuarios",
                adminOnly: true
            },
            {
                title: "Auditoría de Bitácora y Consola",
                desc: "Inspecciona el historial de transacciones, accesos exitosos y fallas de autenticación con registro de IPs.",
                icon: Shield,
                color: "#8b5cf6",
                tab: "auditoria",
                adminOnly: true
            }
        ];

        const visibleBento = bentoItems.filter(item => {
            if (item.adminOnly) {
                return user?.rol === 'ADMIN' || user?.is_staff;
            }
            return true;
        });

        return (
            <div className="fade-in">
                {/* 1. ESTADÍSTICAS GLOBALES DE CONTROL */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                    gap: '1.5rem', 
                    marginBottom: '3rem' 
                }}>
                    <Card style={{ padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Usuarios Registrados</span>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.25rem 0', color: 'var(--text-primary)' }}>{totalUsers}</h2>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Agentes en el Directorio</span>
                            </div>
                            <div style={{ padding: '0.55rem', background: 'rgba(37, 99, 235, 0.08)', color: 'var(--brand-primary)', borderRadius: '10px' }}>
                                <Users size={20} />
                            </div>
                        </div>
                    </Card>

                    <Card style={{ padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Desafíos Lógicos</span>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.25rem 0', color: 'var(--text-primary)' }}>{totalChallenges}</h2>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Trivias, Puzzles y Paradojas</span>
                            </div>
                            <div style={{ padding: '0.55rem', background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', borderRadius: '10px' }}>
                                <Database size={20} />
                            </div>
                        </div>
                    </Card>

                    <Card style={{ padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resoluciones Totales</span>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.25rem 0', color: 'var(--text-primary)' }}>{totalResolutions}</h2>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Ejercicios Completados</span>
                            </div>
                            <div style={{ padding: '0.55rem', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', borderRadius: '10px' }}>
                                <CheckCircle2 size={20} />
                            </div>
                        </div>
                    </Card>

                    <Card style={{ padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Exámenes Activos</span>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.25rem 0', color: 'var(--text-primary)' }}>{totalActiveEvaluations}</h2>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Evaluaciones Habilitadas</span>
                            </div>
                            <div style={{ padding: '0.55rem', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderRadius: '10px' }}>
                                <ClipboardCheck size={20} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 2. BENTO GRID DE GESTIÓN */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                        <Layout size={22} style={{ color: 'var(--brand-primary)' }} />
                        Consola de Gestión Académica
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Acceso directo a las herramientas de control y configuración del sistema.
                    </p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '1.5rem',
                    marginBottom: '2rem' 
                }}>
                    {visibleBento.map((item, idx) => (
                        <Link key={idx} to={`/admin?tab=${item.tab}`} style={{ textDecoration: 'none' }}
                              onMouseEnter={() => setHoveredCard(`bento-${idx}`)}
                              onMouseLeave={() => setHoveredCard(null)}>
                            <Card style={{ 
                                padding: '1.85rem', 
                                borderLeft: `5px solid ${item.color}`, 
                                display: 'flex', 
                                gap: '1.25rem',
                                alignItems: 'flex-start',
                                height: '100%',
                                borderRadius: '16px',
                                borderTop: '1px solid var(--border-default)',
                                borderRight: '1px solid var(--border-default)',
                                borderBottom: '1px solid var(--border-default)',
                                boxShadow: hoveredCard === `bento-${idx}` ? '0 12px 30px -10px rgba(0,0,0,0.08), var(--shadow-glow)' : 'var(--shadow-sm)',
                                transform: hoveredCard === `bento-${idx}` ? 'translateY(-4px)' : 'none',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: 'var(--bg-surface)'
                            }}>
                                <div style={{ 
                                    width: '44px',
                                    height: '44px',
                                    padding: '0.6rem', 
                                    background: `${item.color}12`, 
                                    color: item.color, 
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '2px'
                                }}>
                                    <item.icon size={22} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ 
                                        margin: 0, 
                                        fontSize: '1.1rem', 
                                        fontWeight: 800, 
                                        color: hoveredCard === `bento-${idx}` ? item.color : 'var(--text-primary)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '6px',
                                        transition: 'color 0.2s'
                                    }}>
                                        {item.title} 
                                        <ArrowRight size={14} style={{ 
                                            opacity: 0.5,
                                            transform: hoveredCard === `bento-${idx}` ? 'translateX(3px)' : 'none',
                                            transition: 'transform 0.2s'
                                        }} />
                                    </h4>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container container fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header del Dashboard Premium */}
            <header className="fade-in" style={{ marginBottom: '2.5rem' }}>
                <div style={{ 
                    padding: '2.25rem 2.5rem', 
                    borderRadius: '24px', 
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(6, 182, 212, 0.03) 100%)', 
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Background Decorative Blur Ring */}
                    <div style={{ 
                        position: 'absolute', 
                        top: '-60px', 
                        right: '-60px', 
                        width: '200px', 
                        height: '200px', 
                        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', 
                        filter: 'blur(30px)', 
                        pointerEvents: 'none' 
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ 
                                width: '60px', 
                                height: '60px', 
                                borderRadius: '50%', 
                                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: '#fff', 
                                fontSize: '1.4rem', 
                                fontWeight: 800,
                                boxShadow: '0 8px 20px -6px rgba(37, 99, 235, 0.4)'
                            }}>
                                {user?.nombres?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <span style={{ 
                                    fontFamily: 'monospace', 
                                    fontSize: '0.72rem', 
                                    letterSpacing: '2px', 
                                    color: 'var(--brand-primary)', 
                                    textTransform: 'uppercase', 
                                    display: 'block', 
                                    marginBottom: '0.35rem', 
                                    fontWeight: 800 
                                }}>
                                    {getFechaActual()}
                                </span>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                                    Hola, <span className="text-gradient">{user?.nombres} {user?.apellidos}</span>
                                </h1>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {getCargo(user?.rol)}
                                </p>
                            </div>
                        </div>

                        {user?.rol === 'ESTUDIANTE' && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-default)' }}>
                                <GraduationCap size={18} style={{ color: 'var(--brand-primary)' }} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Ingeniería en Sistemas</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Renderizar según rol */}
            {user?.rol === 'ESTUDIANTE' ? renderStudentDashboard() : renderAdminDashboard()}
        </div>
    );
};

export default Dashboard;