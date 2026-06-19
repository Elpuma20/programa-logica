import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Zap, Shield, Search, Users, Activity, BarChart3, Clock, Database, UserCheck, ShieldAlert, Cpu, LayoutDashboard, Brain, HelpCircle, Puzzle, ScrollText, CheckCircle2, AlertCircle, ChevronRight, ArrowLeft, ShieldCheck, Key, BrainCircuit, Server, Lock, Monitor, HardDrive, Globe, AlertTriangle, RefreshCw, Save, Edit3, Trash2, Plus, X, ClipboardCheck, FileText, Mail, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

// Helper Components & Functions
const NavButton = ({ id, label, icon: Icon, active, onClick, color }) => (
    <button onClick={() => onClick(id)} style={{ 
        width: '100%', padding: '0.86rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: active === id ? 'var(--accent-light)' : 'transparent',
        color: active === id ? (color || 'var(--brand-primary)') : 'var(--text-secondary)',
        border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700, textAlign: 'left', marginBottom: '0.25rem'
    }}>
        <Icon size={18} /> {label}
    </button>
);

const getTabTitle = (tab) => {
    const titles = {
        'usuarios': 'Directorio de Personal Autorizado',
        'progreso': 'Monitoreo de Progreso Estudiantil',
        'reportes': 'Análisis de Resultados y Participación',
        'mantenimiento': 'Supervisión de Infraestructura Crítica',
        'seguridad': 'Blindaje y Protocolos de Acceso',
        'auditoria': 'Registro Histórico de Operaciones',
        'trivia': 'Base de Datos de Trivias',
        'adivinanza': 'Repositorio de Adivinanzas',
        'rompecabezas': 'Inventario de Desafíos Lógicos',
        'paradoja': 'Archivo de Paradojas Teóricas',
        'evaluaciones': 'Gestión de Evaluaciones'
    };
    return titles[tab] || 'Módulo de Operaciones';
};

const getDataCount = (tab, data) => {
    if (tab === 'usuarios') return (data.usersList || []).length;
    if (tab === 'progreso') return data.studentProgress?.estudiantes?.length || 0;
    if (tab === 'auditoria') return (data.logs || []).length;
    if (tab === 'reportes') return data.adminStats?.total_resolutions || 0;
    if (['trivia', 'adivinanza', 'rompecabezas', 'paradoja'].includes(tab)) {
        return (Array.isArray(data.contents) ? data.contents : []).filter(c => c.tipo === tab).length;
    }
    return 0;
};

const getAddButtonText = (tab) => {
    const texts = {
        'trivia': 'Agregar Trivia',
        'adivinanza': 'Agregar Adivinanza',
        'rompecabezas': 'Agregar Rompecabezas',
        'paradoja': 'Agregar Paradojas'
    };
    return texts[tab] || 'Agregar Registro';
};

const renderActiveTabContent = (tab, props) => {
    const { 
        usersList, logs, contents, adminStats, systemStatus, securityStatus, studentProgress, 
        handleVerifyUser, handleOpenModal, handleDelete, handleDeleteUser, loading,
        auditFilters, setAuditFilters, handleSendResetPassword, handleOpenReport,
        evaluacionesList, handleDeleteEvaluacion, handleOpenEvalModal,
        user,
        selectedSeccion, selectedJuego, setSelectedSeccion, setSelectedJuego, fetchStudentProgress,
        selectedHistorialUsuario, setSelectedHistorialUsuario,
        handleToggleActive, handleToggleEvalActive
    } = props;

    switch(tab) {
        case 'progreso':
            const totalDesafios = studentProgress?.meta?.total_desafios || 1;
            const secciones = studentProgress?.secciones_disponibles || [];
            const juegos = studentProgress?.juegos_disponibles || [];
            const sexoStats = studentProgress?.meta?.distribucion_sexo || { 'Masculino': 0, 'Femenino': 0 };
            const seccionStats = studentProgress?.meta?.distribucion_seccion || {};

            return (
                <div className="fade-in">
                    {/* Filtros de Reporte */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '1.5rem', 
                        marginBottom: '2rem',
                        background: 'var(--bg-secondary)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)'
                    }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Filtrar por Sección</label>
                            <select 
                                value={selectedSeccion}
                                onChange={(e) => {
                                    setSelectedSeccion(e.target.value);
                                    fetchStudentProgress(e.target.value, selectedJuego);
                                }}
                                style={{ 
                                    width: '100%', padding: '0.6rem', borderRadius: '8px', 
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)', 
                                    color: 'var(--text-primary)', fontSize: '0.85rem'
                                }}
                            >
                                <option value="">TODAS LAS SECCIONES</option>
                                {secciones.map(sec => (
                                    <option key={sec} value={sec}>{sec}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Filtrar por Actividad / Juego</label>
                            <select 
                                value={selectedJuego}
                                onChange={(e) => {
                                    setSelectedJuego(e.target.value);
                                    fetchStudentProgress(selectedSeccion, e.target.value);
                                }}
                                style={{ 
                                    width: '100%', padding: '0.6rem', borderRadius: '8px', 
                                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)', 
                                    color: 'var(--text-primary)', fontSize: '0.85rem'
                                }}
                            >
                                <option value="">TODAS LAS ACTIVIDADES (GENERAL)</option>
                                {juegos.map(j => (
                                    <option key={j.id} value={j.id}>{j.titulo} ({j.tipo})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Resumen Agrupado por Sección y por Sexo */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', marginBottom: '2rem' }} className="grid-responsive-two">
                        <Card style={{ padding: '1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Distribución por Sexo</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Femenino</span>
                                    <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', color: '#ec4899' }}>{sexoStats.Femenino}</h3>
                                </div>
                                <div style={{ width: '1px', height: '30px', background: 'var(--border-default)' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Masculino</span>
                                    <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', color: '#2563eb' }}>{sexoStats.Masculino}</h3>
                                </div>
                            </div>
                        </Card>
                        <Card style={{ padding: '1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Distribución por Sección</h4>
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                                {Object.entries(seccionStats).map(([sec, count]) => (
                                    <div key={sec} style={{ textAlign: 'center', minWidth: '80px' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{sec}</span>
                                        <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.2rem', color: 'var(--brand-primary)' }}>{count}</h3>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Tabla de Métricas del Monitoreo */}
                    <div className="responsive-table-container">
                        <table className="responsive-table">
                            <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>ESTUDIANTE</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>SECCIÓN</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>SEXO</th>
                                    {selectedJuego ? (
                                        <>
                                            <th style={{ padding: '1rem', textAlign: 'center' }}>CALIFICACIÓN</th>
                                            <th style={{ padding: '1rem', textAlign: 'center' }}>INTENTOS</th>
                                            <th style={{ padding: '1rem', textAlign: 'center' }}>TIEMPO EMPLEADO</th>
                                        </>
                                    ) : (
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>PROGRESO LOGRADO</th>
                                    )}
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(studentProgress?.estudiantes || []).map(est => {
                                    const porcentaje = Math.round((est.total_resoluciones / totalDesafios) * 100);
                                    const progressColor = porcentaje >= 70 ? '#10b981' : porcentaje >= 30 ? '#f59e0b' : '#ef4444';
                                    
                                    const formatTime = (seconds) => {
                                        if (!seconds) return '0s';
                                        const mins = Math.floor(seconds / 60);
                                        const secs = seconds % 60;
                                        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
                                    };

                                    return (
                                        <tr key={est.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 800 }}>{est.nombres} {est.apellidos}</div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{est.correo}</div>
                                                {!selectedJuego && (est.historial || []).length > 0 && (
                                                    <div className="hide-mobile" style={{ marginTop: '0.75rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                        <strong>MÓDULOS RECIENTES:</strong>
                                                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                                            {est.historial.map(h => (
                                                                <Badge key={h.id} variant="secondary" style={{ fontSize: '0.55rem', padding: '1px 6px' }}>
                                                                    {h.contenido_titulo?.split(' ')[0]}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <Badge variant="outline">{est.seccion}</Badge>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {est.sexo}
                                            </td>
                                            {selectedJuego ? (
                                                <>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <Badge style={{
                                                            background: est.aprobado ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                            color: est.aprobado ? '#10b981' : '#ef4444',
                                                            border: `1px solid ${est.aprobado ? '#10b98133' : '#ef444433'}`,
                                                            fontWeight: 800
                                                        }}>
                                                            {est.calificacion}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>
                                                        {est.intentos}
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'center', fontFamily: 'monospace' }}>
                                                        {formatTime(est.tiempo_usado)}
                                                    </td>
                                                </>
                                            ) : (
                                                <td style={{ padding: '1rem', width: '30%' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ flex: 1, height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${porcentaje}%`, height: '100%', background: progressColor, transition: 'width 0.5s' }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, minWidth: '40px', color: progressColor }}>{porcentaje}%</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                                    {selectedJuego && est.historial && est.historial.length > 0 && (
                                                        <Button 
                                                            variant="ghost" 
                                                            style={{ color: 'var(--brand-secondary)', padding: '0.4rem' }}
                                                            onClick={() => setSelectedHistorialUsuario(est)}
                                                            title="Ver historial detallado de intentos"
                                                        >
                                                            <Clock size={16} />
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        variant="ghost" 
                                                        style={{ color: 'var(--brand-primary)', padding: '0.4rem' }}
                                                        onClick={() => setFeedbackModal({ open: true, student: est, text: '' })}
                                                        title="Enviar retroalimentación"
                                                    >
                                                        <Zap size={16} />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        style={{ color: '#8b5cf6', padding: '0.4rem' }}
                                                        onClick={() => handleOpenReport(est.id)}
                                                        title="Ver de fortalezas/debilidades"
                                                    >
                                                        <FileText size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        case 'usuarios':
            return (
                <div className="fade-in">
                    <div className="responsive-table-container">
                        <table className="responsive-table">
                            <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>AGENTE</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>ROL / ÁREA</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>ID / CORREO</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>ESTADO</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>OPERACIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map(u => (
                                    <tr key={u.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{u.nombres} {u.apellidos}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <Badge variant={u.rol === 'ADMIN' ? 'danger' : u.rol === 'DOCENTE' ? 'primary' : 'outline'}>{u.rol}</Badge>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{u.cedula}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{u.correo}</div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <Badge style={{ 
                                                background: u.is_verified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                                color: u.is_verified ? '#10b981' : '#ef4444',
                                                border: `1px solid ${u.is_verified ? '#10b98133' : '#ef444433'}` 
                                            }}>
                                                {u.is_verified ? '✓ OK' : '✗ ALERTA'}
                                            </Badge>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleVerifyUser(u.id)}
                                                    style={{ color: u.is_verified ? '#ef4444' : '#10b981', padding: '0.4rem' }}
                                                    title={u.is_verified ? 'Revocar verificación' : 'Verificar usuario'}
                                                >
                                                    <Zap size={16} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleSendResetPassword(u.id)}
                                                    style={{ color: 'var(--brand-primary)', padding: '0.4rem' }}
                                                    title="Enviar enlace de cambio de contraseña"
                                                >
                                                    <Key size={16} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    style={{ color: '#ef4444', padding: '0.4rem' }}
                                                    title="Eliminar usuario"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        case 'reportes':
            return (
                <div className="fade-in">
                    <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Métricas por Rol</p>
                            {Object.entries(adminStats?.users_by_role || {}).map(([role, count]) => (
                                <div key={role} style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                                        <span>{role}</span>
                                        <span style={{ fontWeight: 700 }}>{count}</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                                        <div style={{ 
                                            width: `${(count / adminStats.total_users) * 100}%`, 
                                            height: '100%', 
                                            background: role === 'ADMIN' ? '#ef4444' : role === 'DOCENTE' ? 'var(--brand-primary)' : '#10b981',
                                            borderRadius: '4px'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="hide-mobile">
                            <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Resoluciones (Últimos 7 Días)</p>
                            <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '20px', borderBottom: '1px solid var(--border-default)' }}>
                                {adminStats?.activity_chart?.data.map((val, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ 
                                            width: '100%', 
                                            height: `${(val / Math.max(...adminStats.activity_chart.data)) * 120}px`, 
                                            background: 'linear-gradient(to top, var(--brand-primary), var(--brand-secondary))',
                                            borderRadius: '4px 4px 0 0',
                                            position: 'relative'
                                        }}>
                                            <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 700 }}>{val}</span>
                                        </div>
                                        <span style={{ fontSize: '0.5rem', writingMode: 'vertical-lr', height: '30px' }}>{adminStats.activity_chart.labels[i].slice(5)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                        {Object.entries(adminStats?.stats_by_type || {}).map(([type, stats]) => (
                            <Card key={type} style={{ padding: '1rem', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '3px solid var(--brand-primary)' }}>
                                <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{type}S</p>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{stats.ejercicios} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ITEMS</span></h3>
                            </Card>
                        ))}
                    </div>
                </div>
            );

        case 'mantenimiento':
            return (
                <div className="fade-in">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                        <Card style={{ padding: '1.5rem', border: '1px solid var(--border-default)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Monitor size={20} style={{ color: 'var(--brand-primary)' }} />
                                <h4 style={{ margin: 0 }}>Especificaciones del Host</h4>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Kernel OS</span> <span>{systemStatus?.server?.os}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Versión Build</span> <span>{systemStatus?.server?.version}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Localización</span> <span>SERVIDOR_LOCAL_01</span></div>
                            </div>
                        </Card>
                        <Card style={{ padding: '1.5rem', border: '1px solid var(--border-default)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Database size={20} style={{ color: '#8b5cf6' }} />
                                <h4 style={{ margin: 0 }}>Persistencia de Datos</h4>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Motor DB</span> <span>SQLite / PostgreSQL</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Latencia</span> <span>{systemStatus?.database?.latency}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Tamaño</span> <span>{systemStatus?.database?.size}</span></div>
                            </div>
                        </Card>
                    </div>
                    
                    <h4 style={{ marginBottom: '1rem' }}>Nodos en el Cluster Cloud</h4>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {systemStatus?.cloud?.services.map(s => (
                            <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Globe size={16} />
                                    <span>Cloud_{s.name}</span>
                                </div>
                                <Badge style={{ background: s.status === 'OK' ? '#10b98133' : '#f59e0b33', color: s.status === 'OK' ? '#10b981' : '#f59e0b' }}>{s.status}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'seguridad':
            return (
                <div className="fade-in">
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ flex: 1, padding: '1.5rem', background: '#064e3b', borderRadius: '12px', border: '1px solid #10b981', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Shield size={32} style={{ color: '#10b981' }} />
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#6ee7b7' }}>Defensa Activa</p>
                                <h3 style={{ margin: 0, color: 'white' }}>Antivirus {securityStatus?.antivirus?.status}</h3>
                                <p style={{ fontSize: '0.7rem', color: '#6ee7b7', margin: 0 }}>Último rastreo: {securityStatus?.antivirus?.last_scan}</p>
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '1.5rem', background: securityStatus?.failed_logins_24h > 2 ? '#450a0a' : '#111827', borderRadius: '12px', border: `1px solid ${securityStatus?.failed_logins_24h > 2 ? '#ef4444' : '#374151'}`, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Lock size={32} style={{ color: securityStatus?.failed_logins_24h > 2 ? '#ef4444' : 'var(--brand-primary)' }} />
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#9ca3af' }}>Control de Intrusión</p>
                                <h3 style={{ margin: 0, color: 'white' }}>{securityStatus?.failed_logins_24h} Fallos de Login</h3>
                                <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0 }}>Ventana de 24 horas</p>
                            </div>
                        </div>
                    </div>

                    <h4 style={{ marginBottom: '1rem' }}>Protocolos de Autenticación</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>OAuth 2.0</span>
                            <div style={{ width: '40px', height: '20px', background: '#10b981', borderRadius: '10px', position: 'relative' }}><div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }} /></div>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>JWT Tokens</span>
                            <div style={{ width: '40px', height: '20px', background: '#10b981', borderRadius: '10px', position: 'relative' }}><div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }} /></div>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>2FA / MFA</span>
                            <div style={{ width: '40px', height: '20px', background: '#374151', borderRadius: '10px', position: 'relative' }}><div style={{ position: 'absolute', left: '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%' }} /></div>
                        </div>
                    </div>

                    <h4 style={{ marginBottom: '1rem' }}>Últimas Conexiones</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <tr>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>AGENTE</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>DIRECCIÓN IP</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>HORA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {securityStatus?.recent_logs.filter(l => l.accion === 'LOGIN').map((l, i) => (
                                <tr key={i} style={{ borderTop: '1px solid var(--border-default)' }}>
                                    <td style={{ padding: '0.75rem' }}>{l.usuario__nombres}</td>
                                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{l.ip_address || '127.0.0.1'}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.8rem' }}>{new Date(l.timestamp).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case 'auditoria':
            const filteredLogs = logs.filter(log => {
                const matchUser = !auditFilters.user || 
                    (log.usuario_detalle?.nombres || 'SISTEMA').toLowerCase().includes(auditFilters.user.toLowerCase());
                const matchLevel = auditFilters.level === 'ALL' || log.nivel === auditFilters.level;
                const matchDate = !auditFilters.date || log.timestamp.includes(auditFilters.date);
                return matchUser && matchLevel && matchDate;
            });

            const chartPoints = (adminStats?.activity_chart?.data || [5, 12, 8, 15, 10, 20, 15, 12, 25, 18, 10]).slice(-10);
            const maxVal = Math.max(...chartPoints, 5);
            const svgWidth = 500;
            const svgHeight = 70;
            const points = chartPoints.map((v, i) => `${(i * (svgWidth/9))},${svgHeight - (v/maxVal * svgHeight)}`).join(' ');

            return (
                <div className="fade-in">
                    {/* Header Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                <div className="pulse" style={{ width: 10, height: 10, background: '#10b981', borderRadius: '50%' }}></div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>System_Node_Active</span>
                            </div>
                            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem', fontWeight: 800 }}>Bitácora de Operaciones</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Trazabilidad completa de acciones y cambios de estado.</p>
                        </div>
                        
                        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', minWidth: '300px' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 800, textAlign: 'center', letterSpacing: '1px' }}>DENSIDAD DE TRÁFICO (7D)</div>
                            <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="auditGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: 'var(--brand-primary)', stopOpacity: 0.15 }} />
                                        <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d={`M 0 ${svgHeight} L ${points} L ${svgWidth} ${svgHeight} Z`}
                                    fill="url(#auditGrad)"
                                />
                                <polyline
                                    fill="none"
                                    stroke="var(--brand-primary)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeJoin="round"
                                    points={points}
                                />
                                {chartPoints.map((v, i) => (
                                    <circle key={i} cx={(i * (svgWidth/9))} cy={svgHeight - (v/maxVal * svgHeight)} r="3.5" fill="var(--bg-surface)" stroke="var(--brand-primary)" strokeWidth="2" />
                                ))}
                            </svg>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1.2fr 1fr 1fr', 
                        gap: '1rem', 
                        marginBottom: '1.5rem',
                        background: 'var(--bg-secondary)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-default)'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                type="text"
                                placeholder="Filtrar por agente..."
                                value={auditFilters.user}
                                onChange={(e) => setAuditFilters({...auditFilters, user: e.target.value})}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.6rem 1rem 0.6rem 2.5rem', 
                                    borderRadius: '8px', 
                                    background: 'var(--bg-surface)', 
                                    border: '1px solid var(--border-default)', 
                                    color: 'var(--text-primary)',
                                    fontSize: '0.85rem'
                                }}
                            />
                        </div>
                        <select 
                            value={auditFilters.level}
                            onChange={(e) => setAuditFilters({...auditFilters, level: e.target.value})}
                            style={{ 
                                padding: '0.6rem', 
                                borderRadius: '8px', 
                                background: 'var(--bg-surface)', 
                                border: '1px solid var(--border-default)', 
                                color: 'var(--text-primary)',
                                fontSize: '0.85rem'
                            }}
                        >
                            <option value="ALL">TODAS LAS PRIORIDADES</option>
                            <option value="INFO">INFO - NORMAL</option>
                            <option value="WARNING">WARNING - ALERTA</option>
                            <option value="CRITICAL">CRITICAL - CRÍTICO</option>
                        </select>
                        <input 
                            type="date"
                            value={auditFilters.date}
                            onChange={(e) => setAuditFilters({...auditFilters, date: e.target.value})}
                            style={{ 
                                padding: '0.6rem', 
                                borderRadius: '8px', 
                                background: 'var(--bg-surface)', 
                                border: '1px solid var(--border-default)', 
                                color: 'var(--text-primary)',
                                fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    {/* Registry Table */}
                    <div style={{ overflow: 'hidden', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                                    <th style={{ padding: '0.86rem 1rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Origen / Agente</th>
                                    <th style={{ padding: '0.86rem 1rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Operación Realizada</th>
                                    <th style={{ padding: '0.86rem 1rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Timestamp</th>
                                    <th style={{ padding: '0.86rem 1rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Nodo IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length > 0 ? filteredLogs.map((log, idx) => {
                                    const isCritical = log.nivel === 'CRITICAL' || log.accion === 'ELIMINAR' || log.accion === 'LOGIN_ERROR';
                                    const isWarning = log.nivel === 'WARNING' || log.accion === 'EDITAR';
                                    
                                    return (
                                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border-default)', transition: 'background 0.2s', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-primary)', opacity: 0.9 }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                                        <Cpu size={16} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{log.usuario_detalle?.nombres || 'S_SYS'}</div>
                                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{log.usuario_detalle?.correo || 'ROOT'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <Badge style={{ 
                                                    background: isCritical ? 'rgba(239, 68, 68, 0.1)' : isWarning ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                    color: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981',
                                                    fontSize: '0.6rem',
                                                    padding: '2px 8px',
                                                    border: `1px solid ${isCritical ? '#ef444433' : isWarning ? '#f59e0b33' : '#10b98133'}`
                                                }}>
                                                    {log.accion} {log.modelo ? `[${log.modelo}]` : ''}
                                                </Badge>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                                {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700 }}>
                                                {log.ip_address || '127.0.0.1'}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '4rem', textAlign: 'center' }}>
                                            <Zap size={32} style={{ color: 'var(--border-default)', marginBottom: '1rem' }} />
                                            <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem' }}>SIN REGISTROS QUE MOSTRAR</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        case 'evaluaciones':
            return (
                <div className="fade-in">
                    <div className="responsive-table-container">
                        <table className="responsive-table">
                            <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>EVALUACIÓN</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>TIPO</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>PREGUNTAS</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>UMBRAL</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>ESTADO</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(evaluacionesList || []).map(ev => (
                                    <tr key={ev.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 700 }}>{ev.titulo}</div>
                                            {ev.descripcion && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{ev.descripcion.slice(0, 60)}...</div>}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <Badge variant="outline">{ev.tipo_logica?.toUpperCase()}</Badge>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>{ev.total_preguntas}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>{ev.umbral_aprobacion}%</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleToggleEvalActive(ev)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                                                title="Hacer clic para Habilitar/Deshabilitar"
                                            >
                                                <Badge style={{ 
                                                    background: ev.activa ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: ev.activa ? '#10b981' : '#ef4444',
                                                    border: `1px solid ${ev.activa ? '#10b98133' : '#ef444433'}`
                                                }}>
                                                    {ev.activa ? '✓ HABILITADO' : '✗ DESHABILITADO'}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <Button variant="ghost" onClick={() => handleOpenEvalModal(ev)} style={{ padding: '0.4rem' }}>
                                                    <Edit3 size={16} />
                                                </Button>
                                                {(user?.rol === 'ADMIN' || user?.is_staff) && (
                                                    <Button variant="ghost" onClick={() => handleDeleteEvaluacion(ev.id)} style={{ color: '#ef4444', padding: '0.4rem' }}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        default: // Contents (Trivia, Adivinanza, etc)
            return (
                <div className="fade-in">
                    <div className="responsive-table-container">
                        <table className="responsive-table">
                            <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>NODO / DESAFÍO</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>COMPLEJIDAD</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>ESTADO</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>OPERACIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(contents) ? contents : []).filter(c => c.tipo === tab).map(item => (
                                    <tr key={item.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 700 }}>{item.titulo}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <Badge variant={item.dificultad === 'facil' ? 'success' : item.dificultad === 'medio' ? 'primary' : 'danger'}>
                                                {(item.dificultad || 'medio').toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleToggleActive(item)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                                                title="Hacer clic para Habilitar/Deshabilitar"
                                            >
                                                <Badge style={{ 
                                                    background: item.activo ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: item.activo ? '#10b981' : '#ef4444',
                                                    border: `1px solid ${item.activo ? '#10b98133' : '#ef444433'}`
                                                }}>
                                                    {item.activo ? '✓ HABILITADO' : '✗ DESHABILITADO'}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <Button variant="ghost" onClick={() => handleOpenModal(item)} style={{ padding: '0.5rem' }}><Edit3 size={16} /></Button>
                                                {(user?.rol === 'ADMIN' || user?.is_staff) && (
                                                    <Button variant="ghost" onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem', color: '#ef4444' }}><Trash2 size={16} /></Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
    }
};

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    
    const [contents, setContents] = useState([]);
    const [logs, setLogs] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [studentProgress, setStudentProgress] = useState(null);
    const [adminStats, setAdminStats] = useState(null);
    const [systemStatus, setSystemStatus] = useState(null);
    const [securityStatus, setSecurityStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(tabParam || (user?.rol === 'DOCENTE' ? 'progreso' : 'usuarios')); 

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        if (activeTab) {
            setSearchParams({ tab: activeTab }, { replace: true });
        }
    }, [activeTab, setSearchParams]); 
    const [selectedSeccion, setSelectedSeccion] = useState('');
    const [selectedJuego, setSelectedJuego] = useState('');
    const [selectedHistorialUsuario, setSelectedHistorialUsuario] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [auditFilters, setAuditFilters] = useState({
        user: '',
        level: 'ALL',
        date: ''
    });
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        tipo: 'trivia', titulo: '', descripcion: '', respuesta: '', opciones: [], dificultad: 'medio', imagen: null
    });
    const [userFormData, setUserFormData] = useState({
        cedula: '', nombres: '', apellidos: '', correo: '', rol: 'ESTUDIANTE', password: 'Password123!', area_estudios: ''
    });
    const [feedbackModal, setFeedbackModal] = useState({ open: false, student: null, text: '' });
    const [notification, setNotification] = useState(null);

    // Estados para Evaluaciones
    const [evaluacionesList, setEvaluacionesList] = useState([]);
    const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
    const [editingEvalItem, setEditingEvalItem] = useState(null);
    const [evalFormData, setEvalFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo_logica: 'general',
        umbral_aprobacion: 60,
        activa: true,
        preguntas: [{ pregunta: '', opciones: ['', '', '', ''], respuesta_correcta: '' }]
    });

    // Estados para Reporte de Rendimiento Cognitivo
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        const canAccess = user?.is_staff || user?.rol === 'ADMIN' || user?.rol === 'DOCENTE';
        if (!canAccess) { 
            navigate('/dashboard'); 
        } else { 
            if (user?.rol === 'DOCENTE' && activeTab === 'usuarios') {
                setActiveTab('progreso');
            }
            fetchAllData();
        }
    }, [user, navigate]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const promises = [
                fetchContents(),
                fetchAdminStats(),
                fetchEvaluaciones()
            ];
            
            if (user?.rol === 'ADMIN' || user?.is_staff) {
                promises.push(fetchLogs());
                promises.push(fetchUsers());
                promises.push(fetchSystemStatus());
                promises.push(fetchSecurityStatus());
            }
            
            if (user?.rol === 'DOCENTE' || user?.rol === 'ADMIN' || user?.is_staff) {
                promises.push(fetchStudentProgress());
            }

            await Promise.all(promises);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvaluaciones = async () => {
        try {
            const res = await api.get('/logica/evaluaciones-admin/');
            setEvaluacionesList(res.data);
        } catch (err) {
            console.error('Error fetching evaluations', err);
        }
    };

    const fetchContents = async () => {
        try { const res = await api.get('/logica/contenido/'); setContents(res.data); } 
        catch (err) { showNotification('Error al cargar contenidos', 'error'); }
    };

    const fetchLogs = async () => {
        try { const res = await api.get('/auditoria/logs/'); setLogs(res.data); } 
        catch (err) { console.error('Error fetching logs', err); }
    };

    const fetchUsers = async () => {
        try { const res = await api.get('/list/'); setUsersList(res.data); } 
        catch (err) { console.error('Error fetching users', err); }
    };

    const fetchAdminStats = async () => {
        try { const res = await api.get('/admin/stats/'); setAdminStats(res.data); } 
        catch (err) { console.error('Error fetching admin stats', err); }
    };

    const fetchSystemStatus = async () => {
        try { const res = await api.get('/admin/system-status/'); setSystemStatus(res.data); } 
        catch (err) { console.error('Error fetching system status', err); }
    };

    const fetchSecurityStatus = async () => {
        try { const res = await api.get('/admin/security-status/'); setSecurityStatus(res.data); } 
        catch (err) { console.error('Error fetching security status', err); }
    };

    const fetchStudentProgress = async (seccionFilter = selectedSeccion, juegoFilter = selectedJuego) => {
        try {
            let url = '/logica/progreso/';
            const params = [];
            if (seccionFilter) params.push(`seccion=${encodeURIComponent(seccionFilter)}`);
            if (juegoFilter) params.push(`juego_id=${encodeURIComponent(juegoFilter)}`);
            if (params.length > 0) url += '?' + params.join('&');
            
            const res = await api.get(url);
            setStudentProgress(res.data);
        } catch (err) {
            console.error('Error fetching student progress', err);
        }
    };

    const handleToggleActive = async (item) => {
        try {
            await api.patch(`/logica/contenido/${item.id}/`, { activo: !item.activo });
            showNotification('Disponibilidad del desafío actualizada');
            fetchContents();
        } catch (err) {
            showNotification('Error al cambiar disponibilidad', 'error');
        }
    };

    const handleToggleEvalActive = async (ev) => {
        try {
            await api.patch(`/logica/evaluaciones-admin/${ev.id}/`, { activa: !ev.activa });
            showNotification('Disponibilidad de la evaluación actualizada');
            fetchEvaluaciones();
        } catch (err) {
            showNotification('Error al cambiar disponibilidad', 'error');
        }
    };

    const handleVerifyUser = async (userId) => {
        try {
            await api.post(`/verify/${userId}/`);
            showNotification('Estado de verificación actualizado');
            fetchUsers();
        } catch (err) {
            showNotification('Error al verificar usuario', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿ELIMINAR AGENTE? Esta operación es irreversible y borrará toda la persistencia asociada al usuario.')) {
            try {
                await api.delete(`/delete/${userId}/`);
                showNotification('Usuario eliminado del sistema');
                fetchUsers();
                fetchAdminStats();
            } catch (err) {
                showNotification(err.response?.data?.error || 'Error al eliminar usuario', 'error');
            }
        }
    };

    const handleSendResetPassword = async (userId) => {
        try {
            const userObj = usersList.find(u => u.id === userId);
            if (!userObj || !userObj.correo) {
                showNotification('El usuario no posee un correo electrónico válido', 'error');
                return;
            }
            await api.post('/password-reset/', { correo: userObj.correo });
            showNotification('Enlace de recuperación enviado con éxito');
        } catch (err) {
            showNotification(err.response?.data?.error || 'Error al enviar enlace de recuperación', 'error');
        }
    };

    const handleOpenReport = async (userId) => {
        setLoadingReport(true);
        try {
            const res = await api.get(`/logica/reporte/${userId}/`);
            setSelectedReport(res.data);
            setIsReportModalOpen(true);
        } catch (err) {
            showNotification(err.response?.data?.error || 'Error al cargar reporte del estudiante', 'error');
        } finally {
            setLoadingReport(false);
        }
    };

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenModal = (item = null) => {
        if (item) { 
            setEditingItem(item); 
            setFormData({ ...item, opciones: item.opciones || [], imagen: null }); 
        } else { 
            setEditingItem(null); 
            setFormData({ 
                tipo: ['trivia', 'adivinanza', 'rompecabezas', 'paradoja'].includes(activeTab) ? activeTab : 'trivia', 
                titulo: '', descripcion: '', respuesta: '', opciones: [], dificultad: 'medio', imagen: null, activo: true
            }); 
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'opciones') {
                data.append(key, JSON.stringify(formData[key]));
            } else if (key === 'imagen') {
                if (formData[key]) data.append(key, formData[key]);
            } else {
                let value = formData[key];
                // For puzzles, if description or answer are missing, provide defaults
                if (formData.tipo === 'rompecabezas') {
                    if (key === 'descripcion' && !value) value = 'Reconstruye la imagen para resolver el desafío.';
                    if (key === 'respuesta' && !value) value = 'SOLVED';
                }
                data.append(key, value);
            }
        });

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingItem) { 
                await api.patch(`/logica/contenido/${editingItem.id}/`, data, config); 
                showNotification('Actualizado exitosamente'); 
            } else { 
                await api.post('/logica/contenido/', data, config); 
                showNotification('Creado exitosamente'); 
            }
            fetchContents(); fetchLogs(); setIsModalOpen(false);
        } catch (err) { 
            console.error(err);
            showNotification('Fallo en la operación', 'error'); 
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register/', userFormData);
            showNotification('Usuario registrado con éxito');
            setIsUserModalOpen(false);
            fetchUsers();
            fetchAdminStats();
        } catch (err) {
            showNotification('Error al registrar usuario', 'error');
        }
    };

    const handleSaveFeedback = async (e) => {
        e.preventDefault();
        try {
            // pk in this case is the student ID, the backend will find their last resolution
            // or we could pass a specific resolution ID if we had one selected.
            await api.post(`/logica/resolucion/${feedbackModal.student.id}/responder/`, {
                comentario: feedbackModal.text
            });
            showNotification('Retroalimentación enviada al estudiante con éxito');
            setFeedbackModal({ open: false, student: null, text: '' });
            fetchStudentProgress(); // refresh to show updated comments if needed
        } catch (err) {
            showNotification('Error al enviar retroalimentación', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Confirmar desactivación de este registro?')) {
            try { 
                await api.delete(`/logica/contenido/${id}/`); 
                showNotification('Eliminado'); 
                fetchContents(); 
            } catch (err) { 
                showNotification('Error al eliminar', 'error'); 
            }
        }
    };

    const handleDeleteEvaluacion = async (id) => {
        if (window.confirm('¿Confirmar la eliminación de esta evaluación?')) {
            try {
                await api.delete(`/logica/evaluaciones-admin/${id}/`);
                showNotification('Evaluación eliminada con éxito');
                fetchEvaluaciones();
                fetchAdminStats();
            } catch (err) {
                showNotification('Error al eliminar la evaluación', 'error');
            }
        }
    };

    const handleOpenEvalModal = (item = null) => {
        if (item) {
            setEditingEvalItem(item);
            setEvalFormData({
                titulo: item.titulo || '',
                descripcion: item.descripcion || '',
                tipo_logica: item.tipo_logica || 'general',
                umbral_aprobacion: item.umbral_aprobacion || 60,
                activa: item.activa !== undefined ? item.activa : true,
                preguntas: item.preguntas || [{ pregunta: '', opciones: ['', '', '', ''], respuesta_correcta: '' }]
            });
        } else {
            setEditingEvalItem(null);
            setEvalFormData({
                titulo: '',
                descripcion: '',
                tipo_logica: 'general',
                umbral_aprobacion: 60,
                activa: true,
                preguntas: [{ pregunta: '', opciones: ['', '', '', ''], respuesta_correcta: '' }]
            });
        }
        setIsEvalModalOpen(true);
    };

    const handleAddQuestion = () => {
        setEvalFormData(prev => ({
            ...prev,
            preguntas: [...prev.preguntas, { pregunta: '', opciones: ['', '', '', ''], respuesta_correcta: '' }]
        }));
    };

    const handleRemoveQuestion = (index) => {
        if (evalFormData.preguntas.length === 1) return;
        setEvalFormData(prev => ({
            ...prev,
            preguntas: prev.preguntas.filter((_, idx) => idx !== index)
        }));
    };

    const handleQuestionTextChange = (index, value) => {
        setEvalFormData(prev => {
            const updated = [...prev.preguntas];
            updated[index].pregunta = value;
            return { ...prev, preguntas: updated };
        });
    };

    const handleOptionTextChange = (qIdx, optIdx, value) => {
        setEvalFormData(prev => {
            const updated = [...prev.preguntas];
            const updatedOptions = [...updated[qIdx].opciones];
            updatedOptions[optIdx] = value;
            updated[qIdx].opciones = updatedOptions;
            return { ...prev, preguntas: updated };
        });
    };

    const handleCorrectAnswerChange = (qIdx, value) => {
        setEvalFormData(prev => {
            const updated = [...prev.preguntas];
            updated[qIdx].respuesta_correcta = value;
            return { ...prev, preguntas: updated };
        });
    };

    const handleEvalSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones básicas de campos
        if (!evalFormData.titulo.trim()) {
            showNotification('El título es obligatorio', 'error');
            return;
        }

        for (let i = 0; i < evalFormData.preguntas.length; i++) {
            const q = evalFormData.preguntas[i];
            if (!q.pregunta.trim()) {
                showNotification(`La pregunta ${i + 1} no tiene texto.`, 'error');
                return;
            }
            if (q.opciones.some(opt => !opt.trim())) {
                showNotification(`La pregunta ${i + 1} tiene opciones vacías.`, 'error');
                return;
            }
            if (!q.respuesta_correcta.trim()) {
                showNotification(`La pregunta ${i + 1} no tiene respuesta correcta seleccionada.`, 'error');
                return;
            }
        }

        try {
            if (editingEvalItem) {
                await api.patch(`/logica/evaluaciones-admin/${editingEvalItem.id}/`, evalFormData);
                showNotification('Evaluación actualizada con éxito');
            } else {
                await api.post('/logica/evaluaciones-admin/', evalFormData);
                showNotification('Evaluación creada con éxito');
            }
            fetchEvaluaciones();
            setIsEvalModalOpen(false);
        } catch (err) {
            console.error(err);
            showNotification('Error al guardar la evaluación', 'error');
        }
    };

    const filteredContents = (Array.isArray(contents) ? contents : []).filter(c => c.tipo === activeTab);

    const statsOverview = [
        { label: 'Agentes Totales', value: usersList.length, icon: Users, color: 'var(--brand-primary)' },
        { label: 'Resoluciones', value: adminStats?.total_resolutions || 0, icon: CheckCircle2, color: '#10b981' },
        { label: 'Nivel Amenaza', value: securityStatus?.threat_level || 'Bajo', icon: Shield, color: '#f59e0b' },
        { label: 'Uptime Sistema', value: systemStatus?.server?.uptime || '---', icon: Activity, color: 'var(--brand-secondary)' }
    ];

    if (loading && !adminStats) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                <BrainCircuit size={64} className="spin" style={{ color: 'var(--brand-primary)', marginBottom: '2rem' }} />
                <h2 className="pulse">Cargando {user?.rol === 'DOCENTE' ? 'Panel Docente' : 'Panel Administrativo'}...</h2>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ paddingBottom: '5rem' }}>
            {/* Admin Header */}
            <header className="admin-header-responsive mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="logo-icon" style={{ width: '42px', height: '42px' }}>
                        <LayoutDashboard size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                        {user?.rol === 'DOCENTE' ? 'Panel Docente' : 'Panel Administrativo'}
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', width: 'auto' }} className="w-full-mobile">
                    <Link to="/dashboard" className="w-full-mobile" style={{ textDecoration: 'none' }}>
                        <Button variant="secondary" className="w-full-mobile"><ArrowLeft size={16} /> Volver</Button>
                    </Link>
                    {(user?.rol === 'ADMIN' || user?.is_staff) && activeTab === 'usuarios' && (
                        <Button onClick={() => setIsUserModalOpen(true)} className="w-full-mobile">
                            <Plus size={18} /> Reclutar
                        </Button>
                    )}
                    
                    {['trivia', 'adivinanza', 'rompecabezas', 'paradoja'].includes(activeTab) && (
                        <Button onClick={() => handleOpenModal()} className="w-full-mobile">
                            <Plus size={18} /> {getAddButtonText(activeTab)}
                        </Button>
                    )}

                    {activeTab === 'evaluaciones' && (
                        <Button onClick={() => handleOpenEvalModal()} className="w-full-mobile">
                            <Plus size={18} /> Crear Evaluación
                        </Button>
                    )}
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {statsOverview.map((s, i) => (
                    <Card key={i} style={{ padding: '1.5rem', borderLeft: `4px solid ${s.color}`, background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '1px' }}>{s.label}</p>
                                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{s.value}</h2>
                            </div>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px', color: s.color }}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) 3.5fr', gap: '2rem' }}>
                {/* Lateral Control Panel */}
                <aside className="admin-sidebar-responsive">
                    <div className="mobile-tabs-scroll show-mobile">
                         <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem 0', scrollbarWidth: 'none' }}>
                            {(user?.rol === 'ADMIN' || user?.is_staff) && (
                                <Button variant="ghost" className={activeTab === 'usuarios' ? 'active-tab' : ''} onClick={() => setActiveTab('usuarios')}>Cuentas</Button>
                            )}
                            <Button variant="ghost" className={activeTab === 'progreso' ? 'active-tab' : ''} onClick={() => setActiveTab('progreso')}>Progreso</Button>
                            <Button variant="ghost" className={activeTab === 'reportes' ? 'active-tab' : ''} onClick={() => setActiveTab('reportes')}>Métricas</Button>
                            <Button variant="ghost" className={activeTab === 'trivia' ? 'active-tab' : ''} onClick={() => setActiveTab('trivia')}>Trivias</Button>
                            <Button variant="ghost" className={activeTab === 'rompecabezas' ? 'active-tab' : ''} onClick={() => setActiveTab('rompecabezas')}>Puzzles</Button>
                            <Button variant="ghost" className={activeTab === 'evaluaciones' ? 'active-tab' : ''} onClick={() => setActiveTab('evaluaciones')}>Evaluaciones</Button>
                         </div>
                    </div>

                    <Card className="hide-mobile" style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--brand-primary)', marginBottom: '1.5rem', padding: '0 1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Núcleo de Gestión</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {(user?.rol === 'ADMIN' || user?.is_staff) && (
                                <NavButton id="usuarios" label="Directorio de Cuentas" icon={Users} active={activeTab} onClick={setActiveTab} />
                            )}
                            <NavButton id="progreso" label="Monitoreo Académico" icon={Activity} active={activeTab} onClick={setActiveTab} />
                            <NavButton id="reportes" label="Centro de Métricas" icon={BarChart3} active={activeTab} onClick={setActiveTab} />
                            <NavButton id="evaluaciones" label="Gestión de Evaluaciones" icon={ClipboardCheck} active={activeTab} onClick={setActiveTab} />
                            
                            {(user?.rol === 'ADMIN' || user?.is_staff) && (
                                <>
                                    <div style={{ margin: '1rem 0', height: '1px', background: 'var(--border-default)' }} />
                                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', padding: '0 1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Operaciones de Infraestructura</p>
                                    <NavButton id="auditoria" label="Bitácora de Sistema" icon={Shield} active={activeTab} onClick={setActiveTab} />
                                    <NavButton id="mantenimiento" label="Salud del Clúster" icon={Server} active={activeTab} onClick={setActiveTab} />
                                </>
                            )}
                            <NavButton id="trivia" label="Trivias" icon={HelpCircle} active={activeTab} onClick={setActiveTab} />
                            <NavButton id="adivinanza" label="Adivinanzas" icon={Brain} active={activeTab} onClick={setActiveTab} />
                            <NavButton id="rompecabezas" label="Puzzles" icon={Puzzle} active={activeTab} onClick={setActiveTab} />
                            <NavButton id="paradoja" label="Paradojas" icon={ScrollText} active={activeTab} onClick={setActiveTab} />
                        </div>
                    </Card>
                </aside>

                {/* Main Dynamic Workspace */}
                <main>
                    <Card style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-default)', minHeight: '600px' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Badge variant="outline" style={{ border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)' }}>MOD_SYS</Badge>
                                <h3 style={{ textTransform: 'uppercase', margin: 0, fontSize: '1rem', letterSpacing: '1px' }}>
                                    {getTabTitle(activeTab)}
                                </h3>
                             </div>
                             <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>VERSIÓN_STABLE</span>
                                <Badge variant="primary">
                                    {getDataCount(activeTab, {usersList, logs, contents, adminStats, studentProgress})} ENTRADAS
                                </Badge>
                             </div>
                        </div>

                        <div className="workspace-content" style={{ padding: '1.5rem' }}>
                            {renderActiveTabContent(activeTab, {
                                usersList, logs, contents, adminStats, systemStatus, securityStatus, studentProgress,
                                handleVerifyUser, handleOpenModal, handleDelete, handleDeleteUser, loading,
                                auditFilters, setAuditFilters,
                                evaluacionesList, handleDeleteEvaluacion, handleOpenEvalModal,
                                user,
                                selectedSeccion, selectedJuego, setSelectedSeccion, setSelectedJuego, fetchStudentProgress,
                                selectedHistorialUsuario, setSelectedHistorialUsuario,
                                handleSendResetPassword, handleOpenReport,
                                handleToggleActive, handleToggleEvalActive
                            })}
                        </div>
                    </Card>
                </main>
            </div>

            {/* Content Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--brand-primary)' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                   <div style={{ width: '40px', height: '40px', background: 'var(--brand-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                       <Database size={20} />
                                   </div>
                                   <h2 style={{ margin: 0 }}>{editingItem ? 'Modificar Registro' : getAddButtonText(activeTab)}</h2>
                               </div>
                               <Button variant="ghost" onClick={() => setIsModalOpen(false)}><X size={24} /></Button>
                         </div>
                         <form onSubmit={handleSubmit}>
                                {formData.tipo !== 'rompecabezas' && (
                                   <>
                                       <Input label="Protocolo / Título del Desafío" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
                                       <div className="input-group">
                                             <label className="input-label">Descripción Detallada / Payload</label>
                                             <textarea className="input-field" rows={4} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required style={{ background: '#0f172a', color: '#10b981', fontFamily: 'monospace' }} />
                                       </div>
                                       <Input label="Respuesta del Oráculo" value={formData.respuesta} onChange={e => setFormData({...formData, respuesta: e.target.value})} required />
                                   </>
                                )}
                                
                                {formData.tipo === 'rompecabezas' && (
                                    <Input label="Título del Rompecabezas" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} placeholder="Ej: Paisaje Lógico" required />
                                )}
                               
                               {formData.tipo === 'trivia' && (
                                   <div className="input-group">
                                       <label className="input-label">Opciones de Selección (Una por línea)</label>
                                       <textarea className="input-field" rows={3} value={formData.opciones.join('\n')} onChange={e => setFormData({...formData, opciones: e.target.value.split('\n')})} placeholder="Opción A&#10;Opción B&#10;Opción C" />
                                   </div>
                               )}

                                {formData.tipo !== 'rompecabezas' && (
                                   <div className="input-group">
                                       <label className="input-label">Grado de Complejidad Computacional</label>
                                       <select className="input-field" value={formData.dificultad} onChange={e => setFormData({...formData, dificultad: e.target.value})}>
                                           <option value="facil">NIVEL 1 - ELEMENTAL</option>
                                           <option value="medio">NIVEL 2 - INTERMEDIO</option>
                                           <option value="dificil">NIVEL 3 - CRÍTICO</option>
                                       </select>
                                   </div>
                                )}

                               {formData.tipo === 'rompecabezas' && (
                                   <div className="input-group">
                                       <label className="input-label">Cargar Escenario Visual (Imagen)</label>
                                       <input 
                                           type="file" 
                                           accept="image/*"
                                           onChange={e => setFormData({...formData, imagen: e.target.files[0]})}
                                           className="input-field"
                                           style={{ height: 'auto', padding: '1rem' }}
                                       />
                                       {editingItem?.imagen && !formData.imagen && (
                                           <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                               Imagen actual: {editingItem.imagen.split('/').pop()} (Sube una nueva para reemplazar)
                                           </p>
                                       )}
                                   </div>
                               )}

                                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                    <label className="input-label">Disponibilidad del Desafío</label>
                                    <select className="input-field" value={formData.activo === undefined || formData.activo ? "true" : "false"} onChange={e => setFormData({...formData, activo: e.target.value === "true"})}>
                                        <option value="true">Habilitado (Visible para estudiantes)</option>
                                        <option value="false">Deshabilitado (Oculto)</option>
                                    </select>
                                </div>

                               <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="w-full">Abortar Operación</Button>
                                    <Button type="submit" className="w-full" style={{ background: 'var(--brand-primary)', color: 'white' }}><Save size={18} /> Comprometer Cambios</Button>
                               </div>
                         </form>
                    </Card>
                </div>
            )}

            {/* User Registration Modal */}
            {isUserModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #10b981' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                   <div style={{ width: '40px', height: '40px', background: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                       <UserCheck size={20} />
                                   </div>
                                   <h2 style={{ margin: 0 }}>Reclutar Nuevo Agente</h2>
                               </div>
                               <Button variant="ghost" onClick={() => setIsUserModalOpen(false)}><X size={24} /></Button>
                         </div>
                         <form onSubmit={handleCreateUser}>
                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                   <Input label="Cédula / ID" value={userFormData.cedula} onChange={e => setUserFormData({...userFormData, cedula: e.target.value})} required />
                                   <div className="input-group">
                                       <label className="input-label">Rol del Sistema</label>
                                       <select className="input-field" value={userFormData.rol} onChange={e => setUserFormData({...userFormData, rol: e.target.value})}>
                                           <option value="ESTUDIANTE">ESTUDIANTE (Usuario Final)</option>
                                           <option value="DOCENTE">DOCENTE (Supervisor)</option>
                                           <option value="ADMIN">ADMIN (Operador de Sistema)</option>
                                       </select>
                                   </div>
                               </div>
                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                   <Input label="Nombres" value={userFormData.nombres} onChange={e => setUserFormData({...userFormData, nombres: e.target.value})} required />
                                   <Input label="Apellidos" value={userFormData.apellidos} onChange={e => setUserFormData({...userFormData, apellidos: e.target.value})} required />
                               </div>
                               <Input label="Correo Electrónico" type="email" value={userFormData.correo} onChange={e => setUserFormData({...userFormData, correo: e.target.value})} required />
                               <Input label="Módulo de Estudios / Área" value={userFormData.area_estudios} onChange={e => setUserFormData({...userFormData, area_estudios: e.target.value})} />
                               <Input label="Contraseña Temporal" type="text" value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} required />

                               <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <Button variant="secondary" onClick={() => setIsUserModalOpen(false)} className="w-full">Cancelar Reclutamiento</Button>
                                    <Button type="submit" className="w-full" style={{ background: '#10b981', color: 'white' }}><CheckCircle2 size={18} /> Confirmar Alta</Button>
                               </div>
                         </form>
                    </Card>
                </div>
            )}

            {notification && (
                <div className="fade-in" style={{ 
                    position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1100,
                    padding: '1rem 2rem', borderRadius: '12px',
                    background: notification.type === 'error' ? '#ef4444' : 'var(--brand-primary)',
                    color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800
                }}>
                    {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    {notification.msg}
                </div>
            )}

            {/* Feedback Modal */}
            {feedbackModal.open && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '500px', border: '1px solid var(--brand-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Badge variant="primary">FEEDBACK</Badge>
                                <h3 style={{ margin: 0 }}>Orientar a {feedbackModal.student?.nombres}</h3>
                            </div>
                            <Button variant="ghost" onClick={() => setFeedbackModal({ open: false, student: null, text: '' })}><X size={20} /></Button>
                        </div>
                        <form onSubmit={handleSaveFeedback}>
                            <div className="input-group">
                                <label className="input-label">Observaciones y Consejos Pedagógicos</label>
                                <textarea 
                                    className="input-field" 
                                    rows={5} 
                                    value={feedbackModal.text} 
                                    onChange={e => setFeedbackModal({...feedbackModal, text: e.target.value})}
                                    placeholder="Escribe aquí tu retroalimentación personalizada..."
                                    required
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button variant="secondary" onClick={() => setFeedbackModal({ open: false, student: null, text: '' })} className="w-full">Cancelar</Button>
                                <Button type="submit" className="w-full"><Save size={18} /> Enviar Guía</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Evaluations Modal */}
            {isEvalModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--brand-primary)', background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: 'var(--brand-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <ClipboardCheck size={20} />
                                </div>
                                <h2 style={{ margin: 0 }}>{editingEvalItem ? 'Modificar Evaluación' : 'Crear Nueva Evaluación'}</h2>
                            </div>
                            <Button variant="ghost" onClick={() => setIsEvalModalOpen(false)}><X size={24} /></Button>
                        </div>
                        <form onSubmit={handleEvalSubmit}>
                            <Input label="Título de la Evaluación" value={evalFormData.titulo} onChange={e => setEvalFormData({...evalFormData, titulo: e.target.value})} required />
                            
                            <div className="input-group">
                                <label className="input-label">Descripción</label>
                                <textarea className="input-field" rows={3} value={evalFormData.descripcion} onChange={e => setEvalFormData({...evalFormData, descripcion: e.target.value})} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Tipo de Lógica</label>
                                    <select className="input-field" value={evalFormData.tipo_logica} onChange={e => setEvalFormData({...evalFormData, tipo_logica: e.target.value})}>
                                        <option value="general">General</option>
                                        <option value="proposicional">Lógica Proposicional</option>
                                        <option value="predicados">Lógica de Predicados</option>
                                        <option value="inferencia">Inferencia y Demostración</option>
                                        <option value="conjuntos">Teoría de Conjuntos</option>
                                        <option value="boole">Álgebra de Boole</option>
                                    </select>
                                </div>
                                <Input label="Umbral de Aprobación (%)" type="number" min="0" max="100" value={evalFormData.umbral_aprobacion} onChange={e => setEvalFormData({...evalFormData, umbral_aprobacion: parseInt(e.target.value) || 0})} required />
                            </div>

                            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="input-label">Estado</label>
                                <select className="input-field" value={evalFormData.activa ? "true" : "false"} onChange={e => setEvalFormData({...evalFormData, activa: e.target.value === "true"})}>
                                    <option value="true">Activa (Visible para estudiantes)</option>
                                    <option value="false">Inactiva (Oculta)</option>
                                </select>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Preguntas de la Evaluación</h3>
                                    <Button type="button" onClick={handleAddQuestion} variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                        <Plus size={16} /> Añadir Pregunta
                                    </Button>
                                </div>

                                {evalFormData.preguntas.map((q, qIdx) => (
                                    <div key={qIdx} style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-default)', marginBottom: '1.25rem', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <Badge variant="outline">Pregunta {qIdx + 1}</Badge>
                                            {evalFormData.preguntas.length > 1 && (
                                                <Button type="button" onClick={() => handleRemoveQuestion(qIdx)} variant="ghost" style={{ color: '#ef4444', padding: '0.25rem' }}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>

                                        <Input 
                                            label="Enunciado de la Pregunta" 
                                            value={q.pregunta} 
                                            onChange={e => handleQuestionTextChange(qIdx, e.target.value)} 
                                            required 
                                        />

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                            {q.opciones.map((opt, optIdx) => (
                                                <Input 
                                                    key={optIdx}
                                                    label={`Opción ${String.fromCharCode(65 + optIdx)}`} 
                                                    value={opt} 
                                                    onChange={e => handleOptionTextChange(qIdx, optIdx, e.target.value)} 
                                                    required 
                                                />
                                            ))}
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label">Respuesta Correcta</label>
                                            <select 
                                                className="input-field" 
                                                value={q.respuesta_correcta} 
                                                onChange={e => handleCorrectAnswerChange(qIdx, e.target.value)}
                                                required
                                            >
                                                <option value="">-- Selecciona la opción correcta --</option>
                                                {q.opciones.map((opt, optIdx) => (
                                                    <option key={optIdx} value={opt} disabled={!opt.trim()}>
                                                        Opción {String.fromCharCode(65 + optIdx)}: {opt || '(vacía)'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <Button variant="secondary" onClick={() => setIsEvalModalOpen(false)} className="w-full">Cancelar</Button>
                                <Button type="submit" className="w-full" style={{ background: 'var(--brand-primary)', color: 'white' }}>
                                    <Save size={18} /> Guardar Evaluación
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Modal de Historial Detallado de Intentos */}
            {selectedHistorialUsuario && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '600px', border: '1px solid var(--brand-secondary)', background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Clock size={20} style={{ color: 'var(--brand-secondary)' }} />
                                <h3 style={{ margin: 0 }}>Historial de Intentos</h3>
                            </div>
                            <Button variant="ghost" onClick={() => setSelectedHistorialUsuario(null)}><X size={20} /></Button>
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <p style={{ margin: 0, fontWeight: 800 }}>Estudiante: {selectedHistorialUsuario.nombres} {selectedHistorialUsuario.apellidos}</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Métrica de Actividad para: {studentProgress?.juegos_disponibles?.find(j => j.id === selectedJuego)?.titulo || selectedJuego}</p>
                        </div>
                        
                        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-default)', borderRadius: '8px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                                    <tr>
                                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Intento</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fecha</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Duración</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Resultado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedHistorialUsuario.historial && selectedHistorialUsuario.historial.length > 0 ? (
                                        selectedHistorialUsuario.historial.map((h, index) => (
                                            <tr key={index} style={{ borderTop: '1px solid var(--border-default)' }}>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 800 }}>#{h.n_intento || (index + 1)}</td>
                                                <td style={{ padding: '0.75rem' }}>{new Date(h.fecha).toLocaleString()}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontFamily: 'monospace' }}>
                                                    {h.tiempo_usado ? (h.tiempo_usado > 60 ? `${Math.floor(h.tiempo_usado / 60)}m ${h.tiempo_usado % 60}s` : `${h.tiempo_usado}s`) : '0s'}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: (h.resultado?.includes('Aprobado') || h.resultado === 'Completado') ? '#10b981' : '#ef4444' }}>
                                                    {h.resultado}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Sin intentos registrados</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={() => setSelectedHistorialUsuario(null)}>Cerrar</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Modal de Reporte de Fortalezas y Debilidades */}
            {isReportModalOpen && selectedReport && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Card style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--brand-primary)', background: 'var(--bg-surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShieldAlert size={22} style={{ color: 'var(--brand-primary)' }} />
                                <h3 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Reporte de Rendimiento Cognitivo</h3>
                            </div>
                            <Button variant="ghost" onClick={() => { setIsReportModalOpen(false); setSelectedReport(null); }}><X size={20} /></Button>
                        </div>

                        {/* Datos del Estudiante */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Estudiante</span>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '0.15rem' }}>{selectedReport.estudiante.nombres} {selectedReport.estudiante.apellidos}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{selectedReport.estudiante.correo}</div>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Programa / Nivel</span>
                                <div style={{ fontWeight: 800, marginTop: '0.15rem' }}>{selectedReport.estudiante.area_estudios || 'Ingeniería en Sistemas'}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{selectedReport.estudiante.semestre ? `${selectedReport.estudiante.semestre}° Semestre` : 'N/A'}</div>
                            </div>
                        </div>

                        {/* Fortalezas y Debilidades */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="grid-responsive-two">
                            {/* Fortalezas */}
                            <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    <TrendingUp size={16} /> Fortalezas Identificadas
                                </div>
                                {selectedReport.fortalezas && selectedReport.fortalezas.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {selectedReport.fortalezas.map((f, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0.6rem', background: 'var(--bg-surface)', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                                                <span style={{ fontWeight: 700 }}>{f.area}</span>
                                                <Badge style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.7rem' }}>
                                                    {f.porcentaje}%
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin fortalezas de nivel crítico registradas aún.</p>
                                )}
                            </div>

                            {/* Debilidades */}
                            <div style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    <TrendingDown size={16} /> Áreas a Reforzar
                                </div>
                                {selectedReport.debilidades && selectedReport.debilidades.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {selectedReport.debilidades.map((d, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0.6rem', background: 'var(--bg-surface)', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                                                <span style={{ fontWeight: 700 }}>{d.area}</span>
                                                <Badge style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.7rem' }}>
                                                    {d.porcentaje}%
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>El estudiante mantiene un rendimiento general estable.</p>
                                )}
                            </div>
                        </div>

                        {/* Estadísticas Generales */}
                        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Métricas Generales de Resolución</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="grid-responsive-two">
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Retos Resueltos</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>{selectedReport.estadisticas_generales.total_resoluciones} / {selectedReport.estadisticas_generales.total_contenido_disponible}</div>
                                </div>
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Porcentaje Retos</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--brand-primary)' }}>
                                        {selectedReport.estadisticas_generales.total_contenido_disponible > 0 ? `${Math.round((selectedReport.estadisticas_generales.total_resoluciones / selectedReport.estadisticas_generales.total_contenido_disponible) * 100)}%` : '0%'}
                                    </div>
                                </div>
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Exámenes Aprobados</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem', color: '#10b981' }}>{selectedReport.estadisticas_generales.evaluaciones_aprobadas}</div>
                                </div>
                                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Exámenes Reprobados</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem', color: '#ef4444' }}>{selectedReport.estadisticas_generales.evaluaciones_reprobadas}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-default)', paddingTop: '1.25rem' }}>
                            <Button variant="secondary" onClick={() => { setIsReportModalOpen(false); setSelectedReport(null); }}>Cerrar Reporte</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};


export default AdminPanel;
