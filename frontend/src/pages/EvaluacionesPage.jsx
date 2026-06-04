import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
    ArrowLeft, CheckCircle2, XCircle, ClipboardCheck,
    ChevronRight, Award, AlertCircle, Clock, BarChart3,
    BookOpen, RefreshCw, Send, Trophy
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const EvaluacionesPage = () => {
    const { user } = useAuth();
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [misResultados, setMisResultados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEval, setSelectedEval] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [resultado, setResultado] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [vista, setVista] = useState('lista'); // lista | evaluacion | resultado | historial

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [evalRes, resultRes] = await Promise.all([
                api.get('/logica/evaluaciones/'),
                api.get('/logica/mis-evaluaciones/')
            ]);
            setEvaluaciones(evalRes.data);
            setMisResultados(resultRes.data);
        } catch (err) {
            console.error('Error cargando evaluaciones:', err);
        } finally {
            setLoading(false);
        }
    };

    const iniciarEvaluacion = (evaluacion) => {
        setSelectedEval(evaluacion);
        setRespuestas({});
        setResultado(null);
        setVista('evaluacion');
    };

    const handleRespuesta = (preguntaIdx, opcion) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaIdx.toString()]: opcion
        }));
    };

    const enviarEvaluacion = async () => {
        if (!selectedEval) return;

        const totalPreguntas = selectedEval.preguntas_sin_respuesta?.length || 0;
        const totalRespondidas = Object.keys(respuestas).length;

        if (totalRespondidas < totalPreguntas) {
            alert(`Debes responder todas las preguntas (${totalRespondidas}/${totalPreguntas}).`);
            return;
        }

        setEnviando(true);
        try {
            const res = await api.post(`/logica/evaluaciones/${selectedEval.id}/responder/`, {
                respuestas
            });
            setResultado(res.data);
            setVista('resultado');
            fetchData(); // Refresh results
        } catch (err) {
            alert(err.response?.data?.error || 'Error al enviar la evaluación.');
        } finally {
            setEnviando(false);
        }
    };

    const getTipoColor = (tipo) => {
        const colores = {
            'proposicional': '#2563eb',
            'predicados': '#8b5cf6',
            'inferencia': '#f59e0b',
            'conjuntos': '#ec4899',
            'boole': '#10b981',
            'general': '#6366f1'
        };
        return colores[tipo] || '#2563eb';
    };

    const getTipoLabel = (tipo) => {
        const labels = {
            'proposicional': 'Lógica Proposicional',
            'predicados': 'Lógica de Predicados',
            'inferencia': 'Inferencia',
            'conjuntos': 'Teoría de Conjuntos',
            'boole': 'Álgebra de Boole',
            'general': 'General'
        };
        return labels[tipo] || tipo;
    };

    if (loading) {
        return (
            <div className="container fade-in" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <RefreshCw className="spin" size={32} style={{ color: 'var(--brand-primary)' }} />
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Cargando evaluaciones...</p>
            </div>
        );
    }

    // VISTA: Resultado de evaluación
    if (vista === 'resultado' && resultado) {
        return (
            <div className="container fade-in" style={{ maxWidth: '700px', paddingBottom: '4rem' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <Button variant="secondary" onClick={() => { setVista('lista'); setResultado(null); setSelectedEval(null); }}>
                        <ArrowLeft size={16} /> Volver
                    </Button>
                </header>

                <Card style={{ textAlign: 'center', borderTop: `4px solid ${resultado.aprobado ? '#10b981' : '#ef4444'}` }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: resultado.aprobado ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        {resultado.aprobado ?
                            <Trophy size={40} style={{ color: '#10b981' }} /> :
                            <XCircle size={40} style={{ color: '#ef4444' }} />
                        }
                    </div>

                    <h2 style={{ marginBottom: '0.5rem' }}>
                        {resultado.aprobado ? '¡APROBADO!' : 'REPROBADO'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        {selectedEval?.titulo}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.25rem' }}>PUNTAJE</p>
                            <h3 style={{ margin: 0 }}>{resultado.puntaje}/{resultado.total_preguntas}</h3>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.25rem' }}>PORCENTAJE</p>
                            <h3 style={{ margin: 0, color: resultado.porcentaje >= resultado.umbral ? '#10b981' : '#ef4444' }}>{resultado.porcentaje}%</h3>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.25rem' }}>UMBRAL</p>
                            <h3 style={{ margin: 0 }}>{resultado.umbral}%</h3>
                        </div>
                    </div>

                    {/* Detalle de respuestas */}
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Detalle de Respuestas</h4>
                        {resultado.detalle?.map((d, i) => (
                            <div key={i} style={{
                                padding: '1rem',
                                marginBottom: '0.75rem',
                                borderRadius: '10px',
                                background: d.es_correcta ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                                border: `1px solid ${d.es_correcta ? '#10b98133' : '#ef444433'}`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    {d.es_correcta ?
                                        <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} /> :
                                        <XCircle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                                    }
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>{d.pregunta}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Tu respuesta: <strong>{d.respuesta_estudiante || '(sin respuesta)'}</strong>
                                        </p>
                                        {!d.es_correcta && (
                                            <p style={{ fontSize: '0.8rem', color: '#10b981' }}>
                                                Correcta: <strong>{d.respuesta_correcta}</strong>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    // VISTA: Realizando evaluación
    if (vista === 'evaluacion' && selectedEval) {
        const preguntas = selectedEval.preguntas_sin_respuesta || [];
        const respondidas = Object.keys(respuestas).length;
        const progreso = preguntas.length > 0 ? (respondidas / preguntas.length) * 100 : 0;

        return (
            <div className="container fade-in" style={{ maxWidth: '700px', paddingBottom: '4rem' }}>
                <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <Button variant="secondary" onClick={() => { setVista('lista'); setSelectedEval(null); }}>
                        <ArrowLeft size={16} /> Salir
                    </Button>
                    <Badge variant="primary">{respondidas}/{preguntas.length} respondidas</Badge>
                </header>

                <Card style={{ borderTop: `4px solid ${getTipoColor(selectedEval.tipo_logica)}` }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0' }}>{selectedEval.titulo}</h2>
                        {selectedEval.descripcion && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedEval.descripcion}</p>
                        )}

                        {/* Barra de progreso */}
                        <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', marginTop: '1rem' }}>
                            <div style={{
                                height: '100%', width: `${progreso}%`,
                                background: 'linear-gradient(to right, var(--brand-primary), var(--brand-secondary))',
                                borderRadius: '3px', transition: 'width 0.3s'
                            }} />
                        </div>
                    </div>

                    {/* Preguntas */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {preguntas.map((p, idx) => (
                            <div key={idx} style={{
                                padding: '1.25rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                border: respuestas[idx.toString()] ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)'
                            }}>
                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <Badge variant="outline" style={{ flexShrink: 0 }}>{idx + 1}</Badge>
                                    <p style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{p.pregunta}</p>
                                </div>

                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {(p.opciones || []).map((opcion, optIdx) => {
                                        const isSelected = respuestas[idx.toString()] === opcion;
                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleRespuesta(idx, opcion)}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '8px',
                                                    border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)',
                                                    background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-surface)',
                                                    color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    fontWeight: isSelected ? 700 : 400,
                                                    transition: 'all 0.2s',
                                                    fontSize: '0.9rem',
                                                    minHeight: '44px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <span style={{
                                                    width: '24px', height: '24px', borderRadius: '50%',
                                                    border: isSelected ? '2px solid var(--brand-primary)' : '2px solid var(--border-default)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0, fontSize: '0.7rem', fontWeight: 800,
                                                    background: isSelected ? 'var(--brand-primary)' : 'transparent',
                                                    color: isSelected ? 'white' : 'var(--text-muted)'
                                                }}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </span>
                                                {opcion}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botón enviar */}
                    <div style={{ marginTop: '2rem' }}>
                        <Button
                            onClick={enviarEvaluacion}
                            disabled={enviando}
                            className="w-full"
                            style={{ padding: '1rem', fontSize: '1rem' }}
                        >
                            {enviando ? <RefreshCw className="spin" size={20} /> : <Send size={20} />}
                            {enviando ? 'Enviando...' : 'Enviar Evaluación'}
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // VISTA: Lista de evaluaciones + historial
    return (
        <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>
                        <span className="text-gradient">Evaluaciones</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                        Evaluaciones no ponderadas — cada pregunta vale lo mismo
                    </p>
                </div>
                <Link to="/dashboard">
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <Button
                    variant={vista === 'lista' ? 'primary' : 'secondary'}
                    onClick={() => setVista('lista')}
                    style={{ flexShrink: 0 }}
                >
                    <ClipboardCheck size={16} /> Disponibles
                </Button>
                <Button
                    variant={vista === 'historial' ? 'primary' : 'secondary'}
                    onClick={() => setVista('historial')}
                    style={{ flexShrink: 0 }}
                >
                    <Clock size={16} /> Mi Historial ({misResultados.length})
                </Button>
            </div>

            {vista === 'historial' ? (
                /* Historial de resultados */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {misResultados.length === 0 ? (
                        <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <BarChart3 size={40} style={{ color: 'var(--border-default)', marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Aún no has completado ninguna evaluación.</p>
                        </Card>
                    ) : (
                        misResultados.map((res) => (
                            <Card key={res.id} style={{
                                borderLeft: `4px solid ${res.aprobado ? '#10b981' : '#ef4444'}`,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                flexWrap: 'wrap', gap: '1rem'
                            }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{res.evaluacion_titulo}</h4>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Badge variant={res.aprobado ? 'success' : 'danger'}>
                                            {res.aprobado ? 'APROBADO' : 'REPROBADO'}
                                        </Badge>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {res.puntaje}/{res.total_preguntas} ({res.porcentaje}%)
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(res.fecha).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    width: 48, height: 48, borderRadius: '50%',
                                    background: res.aprobado ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {res.aprobado ?
                                        <CheckCircle2 size={24} style={{ color: '#10b981' }} /> :
                                        <XCircle size={24} style={{ color: '#ef4444' }} />
                                    }
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                /* Lista de evaluaciones disponibles */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {evaluaciones.length === 0 ? (
                        <Card style={{ textAlign: 'center', padding: '3rem 1rem', gridColumn: '1 / -1' }}>
                            <BookOpen size={40} style={{ color: 'var(--border-default)', marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)' }}>No hay evaluaciones disponibles en este momento.</p>
                        </Card>
                    ) : (
                        evaluaciones.map((ev) => {
                            const color = getTipoColor(ev.tipo_logica);
                            const yaRealizada = misResultados.some(r => r.evaluacion === ev.id);
                            return (
                                <Card key={ev.id} style={{ borderTop: `4px solid ${color}`, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <Badge style={{ background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: '0.65rem' }}>
                                            {getTipoLabel(ev.tipo_logica)}
                                        </Badge>
                                        {yaRealizada && (
                                            <Badge variant="success" style={{ fontSize: '0.6rem' }}>
                                                <CheckCircle2 size={10} /> COMPLETADA
                                            </Badge>
                                        )}
                                    </div>

                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{ev.titulo}</h3>
                                    {ev.descripcion && (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', flex: 1 }}>
                                            {ev.descripcion}
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-default)' }}>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <span><strong>{ev.total_preguntas}</strong> preguntas</span>
                                            <span>Mínimo: <strong>{ev.umbral_aprobacion}%</strong></span>
                                        </div>
                                        <Button
                                            onClick={() => iniciarEvaluacion(ev)}
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                        >
                                            Iniciar <ChevronRight size={14} />
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default EvaluacionesPage;
