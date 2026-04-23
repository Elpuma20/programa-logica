import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { 
    BrainCircuit, ArrowLeft, Mail, 
    CheckCircle, AlertCircle, RefreshCw 
} from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const PasswordRecovery = () => {
    const [correo, setCorreo] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        
        try {
            const res = await api.post('/password-reset/', { correo });
            setMessage({ type: 'success', text: res.data.message });
            // No redirigimos inmediatamente para que el usuario lea el mensaje
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
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <Card className="fade-in" style={{ width: '450px', maxWidth: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="flex-center mb-4">
                        <div style={{ 
                            width: 64, height: 64,
                            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', 
                            borderRadius: '18px',
                            color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)'
                        }}>
                            <BrainCircuit size={32} />
                        </div>
                    </div>
                    <h2 className="mb-2">Recuperar <span className="text-gradient">Acceso</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ingresa tu correo para recibir un enlace de recuperación</p>
                </div>

                {!message || message.type !== 'success' ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <Input 
                                label="Correo Institucional"
                                name="correo"
                                type="email"
                                placeholder="usuario@institucion.edu"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                icon={<Mail size={18} />}
                                required
                            />

                            {message && message.type === 'error' && (
                                <div className="fade-in" style={{ 
                                    padding: '1rem', 
                                    background: 'rgba(239, 68, 68, 0.1)', 
                                    color: '#ef4444', 
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}>
                                    <AlertCircle size={18} />
                                    {message.text}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading}
                                style={{ height: '3.5rem' }}
                            >
                                {loading ? <RefreshCw className="spin" size={20} /> : 'Enviar Enlace de Recuperación'}
                            </Button>
                        </div>
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
                        <h3 className="mb-3">¡Correo Enviado!</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Hemos enviado un enlace seguro a <strong>{correo}</strong>. 
                            Revisa tu bandeja de entrada (y la carpeta de spam) para continuar.
                        </p>
                        <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                            Volver al Login
                        </Button>
                    </div>
                )}

                <div style={{ 
                    marginTop: '2rem', 
                    textAlign: 'center', 
                    paddingTop: '1.5rem', 
                    borderTop: '1px solid var(--border-default)' 
                }}>
                    <Link to="/login" style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.95rem', 
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
    );
};

export default PasswordRecovery;
