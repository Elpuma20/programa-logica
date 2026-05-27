import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { 
    BrainCircuit, ArrowLeft, Mail, 
    CheckCircle, AlertCircle, RefreshCw 
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const backgrounds = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg'
];

const PasswordRecovery = () => {
    const [correo, setCorreo] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        
        try {
            const res = await api.post('/password-reset/', { correo });
            setMessage({ type: 'success', text: res.data.message });
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.error || 'No se pudo procesar la solicitud. Verifica el correo e intenta de nuevo.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
            {backgrounds.map((bg, index) => (
                <div key={bg} style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${bg})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    opacity: currentBg === index ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    zIndex: 0
                }}></div>
            ))}

            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', zIndex: 1 }}></div>

            <div style={{ display: 'flex', position: 'relative', zIndex: 2, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Card className="fade-in" style={{ 
                    width: '420px', 
                    maxWidth: '95%', 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '2.5rem',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="flex-center mb-4">
                            <div style={{ 
                                width: 64, height: 64,
                                background: '#2563eb', 
                                borderRadius: '18px',
                                color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto'
                            }}>
                                <BrainCircuit size={32} />
                            </div>
                        </div>
                        <h2 className="mb-2" style={{ color: '#1e293b', fontSize: '1.75rem', fontWeight: 800 }}>
                            Recuperar <span style={{ color: '#2563eb' }}>Acceso</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ingresa tu correo para recibir un enlace de recuperación</p>
                    </div>

                    {!message || message.type !== 'success' ? (
                        <form onSubmit={handleSubmit}>
                            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="input-label" style={{textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#555'}}>Correo Institucional</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        className="input-field"
                                        type="email"
                                        placeholder="usuario@institucion.edu"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        required
                                        style={{ paddingLeft: '2.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)' }}
                                    />
                                </div>
                            </div>

                            {message && message.type === 'error' && (
                                <div className="fade-in" style={{ 
                                    padding: '1rem', 
                                    background: 'rgba(239, 68, 68, 0.1)', 
                                    color: '#ef4444', 
                                    borderRadius: '12px',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    fontSize: '0.85rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <AlertCircle size={18} />
                                    {message.text}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading}
                                style={{ 
                                    height: '3.5rem', 
                                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                    border: 'none',
                                    fontSize: '1rem',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            >
                                {loading ? <RefreshCw className="spin" size={20} /> : 'Enviar Enlace de Recuperación'}
                            </Button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ 
                                width: 60, height: 60, 
                                background: 'rgba(16, 185, 129, 0.1)', 
                                color: '#10b981',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.5rem auto'
                            }}>
                                <CheckCircle size={32} />
                            </div>
                            <h3 style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>¡Correo Enviado!</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
                                Hemos enviado un enlace seguro a <strong>{correo}</strong>. 
                                Revisa tu bandeja de entrada (y la carpeta de spam) para continuar.
                            </p>
                            <Button className="w-full" onClick={() => navigate('/login')} style={{ height: '3.5rem', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600 }}>
                                Volver al Login
                            </Button>
                        </div>
                    )}

                    <div style={{ 
                        marginTop: '2rem', 
                        textAlign: 'center', 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}>
                        <Link to="/login" style={{ 
                            color: '#2563eb', 
                            fontSize: '0.85rem', 
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}>
                            <ArrowLeft size={16} /> Volver al Inicio de Sesión
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PasswordRecovery;
