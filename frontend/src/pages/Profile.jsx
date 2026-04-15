import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { User, Mail, Shield, Calendar, ArrowLeft, Award, Settings, MessageCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Profile = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/logica/historial/');
                setHistory(res.data);
            } catch (err) {
                console.error('Error fetching history', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (!user) return (
        <div className="container flex-center" style={{ minHeight: '60vh' }}>
            <h2 className="text-gradient">Identificando Agente...</h2>
        </div>
    );

    return (
        <div className="container fade-in" style={{ maxWidth: '800px' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
                <div className="hide-mobile">
                    <Link to="/configuracion" style={{ textDecoration: 'none' }}>
                        <Button variant="ghost"><Settings size={18} /> Configuración</Button>
                    </Link>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Profile Info */}
                <Card style={{ textAlign: 'center' }}>
                    <div className="flex-center mb-4">
                        <div style={{
                            width: 120, height: 120, borderRadius: '30px',
                            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', 
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                        }}>
                            <User size={60} />
                        </div>
                    </div>
                    <h2 className="mb-2" style={{ fontSize: '1.5rem' }}>{user.nombres} {user.apellidos}</h2>
                    <Badge variant="success" className="mb-4">Estatus: Activo</Badge>
                    
                    <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '2rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                            <div style={{ padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: '10px', color: 'var(--brand-primary)' }}>
                                <Mail size={18} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>CORREO</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.correo}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                            <div style={{ padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: '10px', color: 'var(--brand-primary)' }}>
                                <Shield size={18} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>ID (CÉDULA)</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.cedula}</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Cognitive Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card style={{ borderLeft: '4px solid var(--brand-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.8rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', color: 'var(--brand-secondary)' }}>
                                <Award size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>Nivel de Lógica</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estadísticas de rendimiento académico</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem', background: 'var(--bg-secondary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                            <span>PROGRESO</span>
                            <span>65%</span>
                        </div>
                    </Card>

                    <Card>
                        <h4 className="mb-4">Actividad Reciente</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {loading ? (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sincronizando bitácora...</p>
                            ) : history.length > 0 ? (
                                history.map((item, i) => (
                                    <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1rem', borderBottom: i < history.length -1 ? '1px solid var(--border-default)' : 'none' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.completado ? '#10b981' : 'var(--brand-primary)' }}></div>
                                                <div>
                                                    <div style={{ fontWeight: 800 }}>{item.contenido_titulo}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={10} /> {new Date(item.fecha_completada).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant={item.completado ? 'success' : 'outline'} style={{ fontSize: '0.6rem' }}>
                                                {item.contenido_tipo?.toUpperCase()}
                                            </Badge>
                                        </div>
                                        
                                        {item.comentario_docente && (
                                            <div style={{ 
                                                background: 'var(--bg-secondary)', 
                                                padding: '0.75rem', 
                                                borderRadius: '10px', 
                                                fontSize: '0.8rem', 
                                                borderLeft: '3px solid var(--brand-primary)',
                                                display: 'flex',
                                                gap: '0.75rem'
                                            }}>
                                                <MessageCircle size={14} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                                                <div>
                                                    <strong style={{ display: 'block', fontSize: '0.65rem', marginBottom: '2px', color: 'var(--brand-primary)' }}>ORIENTACIÓN DOCENTE:</strong>
                                                    {item.comentario_docente}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No se registran misiones completadas aún.</p>
                                    <Link to="/juegos"><Button variant="secondary" size="sm">Ir al Laboratorio</Button></Link>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
