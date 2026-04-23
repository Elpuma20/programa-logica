import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Zap, Shield, Search, Users, Activity, BarChart3, Clock, Database, UserCheck, ShieldAlert, Cpu, LayoutDashboard, Brain, HelpCircle, Puzzle, ScrollText, CheckCircle2, AlertCircle, ChevronRight, ArrowLeft, ShieldCheck, Key, BrainCircuit, Server, Lock, Monitor, HardDrive, Globe, AlertTriangle, RefreshCw, Save, Edit3, Trash2, Plus, X } from 'lucide-react';
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
        'paradoja': 'Archivo de Paradojas Teóricas'
    };
    return titles[tab] || 'Módulo de Operaciones';
};

const getDataCount = (tab, data) => {
    if (tab === 'usuarios') return (data.usersList || []).length;
    if (tab === 'progreso') return data.studentProgress?.estudiantes?.length || 0;
    if (tab === 'auditoria') return (data.logs || []).length;
    if (tab === 'reportes') return data.adminStats?.total_resolutions || 0;
    if (['trivia', 'adivinanza', 'rompecabezas', 'paradoja'].includes(tab)) {
        return (data.contents || []).filter(c => c.tipo === tab).length;
    }
    return 0;
};


const renderActiveTabContent = (tab, props) => {
    const { 
        usersList, logs, contents, adminStats, systemStatus, securityStatus, studentProgress, 
        handleVerifyUser, handleOpenModal, handleDelete, handleDeleteUser, loading,
        auditFilters, setAuditFilters
    } = props;

    switch(tab) {
        case 'progreso':
            const totalDesafios = studentProgress?.meta?.total_desafios || 1;
            return (
                <div className="fade-in">
                    <div className="responsive-table-container">
                        <table className="responsive-table">
                            <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>ESTUDIANTE</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>ÁREA / MÓDULO</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>PROGRESO LOGRADO</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(studentProgress?.estudiantes || []).map(est => {
                                    const porcentaje = Math.round((est.total_resoluciones / totalDesafios) * 100);
                                    return (
                                        <tr key={est.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 800 }}>{est.nombres} {est.apellidos}</div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{est.correo}</div>
                                                {(est.historial || []).length > 0 && (
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
                                            <td style={{ padding: '1rem' }}>
                                                <Badge variant="outline">{est.area_estudios || 'LOGICA_INTRO'}</Badge>
                                                {(est.historial || []).some(h => h.comentario_docente) && (
                                                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: '#10b981' }}>
                                                        <MessageCircle size={10} /> Feedback Enviado
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', width: '30%' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${porcentaje}%`, height: '100%', background: 'linear-gradient(to right, var(--brand-primary), var(--brand-secondary))' }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, minWidth: '40px' }}>{porcentaje}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <Button 
                                                    variant="ghost" 
                                                    style={{ color: 'var(--brand-primary)', position: 'relative' }}
                                                    onClick={() => setFeedbackModal({ open: true, student: est, text: '' })}
                                                >
                                                    <Zap size={18} />
                                                </Button>
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
                                                background: u.is_verified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(37, 99, 235, 0.1)', 
                                                color: u.is_verified ? '#10b981' : 'var(--brand-primary)',
                                                border: `1px solid ${u.is_verified ? '#10b98133' : 'rgba(37, 99, 235, 0.2)'}` 
                                            }}>
                                                {u.is_verified ? 'OK' : 'PND'}
                                            </Badge>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleVerifyUser(u.id)}
                                                    style={{ color: u.is_verified ? '#ef4444' : '#10b981' }}
                                                >
                                                    <Zap size={18} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <Trash2 size={18} />
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

        default: // Contents (Trivia, Adivinanza, etc)
            return (
                <div className="fade-in">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>NODO / DESAFÍO</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>COMPLEJIDAD</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>OPERACIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contents.filter(c => c.tipo === tab).map(item => (
                                <tr key={item.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 700 }}>{item.titulo}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Badge variant={item.dificultad === 'facil' ? 'success' : item.dificultad === 'medio' ? 'primary' : 'danger'}>
                                            {item.dificultad.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Button variant="ghost" onClick={() => handleOpenModal(item)} style={{ padding: '0.5rem' }}><Edit3 size={16} /></Button>
                                            <Button variant="ghost" onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem', color: '#ef4444' }}><Trash2 size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
    }
};

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [contents, setContents] = useState([]);
    const [logs, setLogs] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [studentProgress, setStudentProgress] = useState(null);
    const [adminStats, setAdminStats] = useState(null);
    const [systemStatus, setSystemStatus] = useState(null);
    const [securityStatus, setSecurityStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('usuarios'); 
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
                fetchAdminStats()
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

    const fetchStudentProgress = async () => {
        try { const res = await api.get('/logica/progreso/'); setStudentProgress(res.data); } 
        catch (err) { console.error('Error fetching student progress', err); }
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
                titulo: '', descripcion: '', respuesta: '', opciones: [], dificultad: 'medio', imagen: null
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

    const filteredContents = contents.filter(c => c.tipo === activeTab);

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
                    {(user?.rol === 'ADMIN' || user?.is_staff) && activeTab === 'usuarios' && <Button onClick={() => setIsUserModalOpen(true)} className="w-full-mobile"><Plus size={18} /> Reclutar</Button>}
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

                    {/* Server Pulse Card */}
                    <Card className="hide-mobile" style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #111827, #1f2937)', border: '1px solid #374151' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div className="pulse" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Estado del Servidor</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>CPU</span>
                            <span style={{ fontSize: '0.7rem', color: 'white', fontFamily: 'monospace' }}>{systemStatus?.server?.cpu_usage}%</span>
                        </div>
                        <div style={{ height: '4px', background: '#374151', borderRadius: '2px', marginBottom: '1rem' }}>
                            <div style={{ width: `${systemStatus?.server?.cpu_usage}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '2px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>RAM</span>
                            <span style={{ fontSize: '0.7rem', color: 'white', fontFamily: 'monospace' }}>{systemStatus?.server?.ram_usage}%</span>
                        </div>
                        <div style={{ height: '4px', background: '#374151', borderRadius: '2px' }}>
                            <div style={{ width: `${systemStatus?.server?.ram_usage}%`, height: '100%', background: '#8b5cf6', borderRadius: '2px' }} />
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
                                auditFilters, setAuditFilters
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
                                   <h2 style={{ margin: 0 }}>{editingItem ? 'Modificar Registro' : `Inyectar ${activeTab}`}</h2>
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
        </div>
    );
};


export default AdminPanel;
