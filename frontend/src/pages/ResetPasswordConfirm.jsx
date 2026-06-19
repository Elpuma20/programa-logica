import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { 
    BrainCircuit, ArrowLeft, Lock, 
    CheckCircle, AlertCircle, RefreshCw 
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const backgrounds = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg'
];

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams();
    const [formData, setFormData] = useState({
        new_password: '',
        confirm_password: ''
    });
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (formData.new_password !== formData.confirm_password) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
            return;
        }

        if (formData.new_password.length < 8) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres.' });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/password-reset-confirm/', {
                uid: uid,
                token: token,
                new_password: formData.new_password
            });
            setMessage({ type: 'success', text: res.data.success || 'Tu contraseña ha sido restablecida con éxito.' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.error || 'El enlace es inválido o ha expirado.' 
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
                <Card className="fade-in auth-card-container" style={{ 
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
                    <div className="auth-header-container">
                        <div className="flex-center mb-4">
                            <div className="auth-logo-icon">
                                <BrainCircuit size={32} />
                            </div>
                        </div>
                        <h2 className="auth-title">Nueva Contraseña</h2>
                        <p className="auth-subtitle">Ingresa tu nueva clave de acceso</p>
                    </div>

                    {!message || message.type !== 'success' ? (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="auth-input-label">Nueva Contraseña</label>
                                    <div style={{ position: 'relative' }}>
                                        <div className="auth-input-icon"><Lock size={18} /></div>
                                        <input 
                                            className="input-field auth-input-field" 
                                            name="new_password"
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={formData.new_password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="auth-input-label">Confirmar Contraseña</label>
                                    <div style={{ position: 'relative' }}>
                                        <div className="auth-input-icon"><Lock size={18} /></div>
                                        <input 
                                            className="input-field auth-input-field" 
                                            name="confirm_password"
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={formData.confirm_password}
                                            onChange={handleChange}
                                            required
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
                                        fontSize: '0.85rem'
                                    }}>
                                        <AlertCircle size={18} />
                                        {message.text}
                                    </div>
                                )}

                                <Button 
                                    type="submit" 
                                    className="w-full auth-btn-submit" 
                                    disabled={loading}
                                >
                                    {loading ? <RefreshCw className="spin" size={20} /> : 'Actualizar Contraseña'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                            <div style={{ 
                                width: 50, height: 50, 
                                background: 'rgba(16, 185, 129, 0.1)', 
                                color: '#10b981',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1.25rem auto'
                            }}>
                                <CheckCircle size={28} />
                            </div>
                            <h3 style={{ color: '#10b981', fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>¡Éxito!</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5, fontSize: '0.85rem' }}>
                                Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio de sesión...
                            </p>
                        </div>
                    )}

                    <div className="auth-footer-container">
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

export default ResetPasswordConfirm;
