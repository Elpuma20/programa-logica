import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { 
    BrainCircuit, ArrowLeft, Mail, 
    CheckCircle, AlertCircle, RefreshCw, Key, Lock, Phone
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const backgrounds = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg'
];

const PasswordRecovery = () => {
    const [phoneOrEmail, setPhoneOrEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Pedir código, 2: Ingresar código y nueva contraseña
    
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

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        
        try {
            const res = await api.post('/auth/forgot-password/', { phone: phoneOrEmail, correo: phoneOrEmail });
            setMessage({ type: 'success', text: res.data.message });
            setStep(2); // Avanzar al siguiente paso
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.error || 'No se pudo procesar la solicitud. Verifica el dato e intenta de nuevo.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        
        try {
            const res = await api.post('/auth/reset-password/', { 
                phone: phoneOrEmail, 
                correo: phoneOrEmail,
                code: code,
                new_password: newPassword
            });
            setMessage({ type: 'success', text: res.data.success });
            setStep(3); // Paso final de éxito
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.error || 'Código inválido o error al procesar. Intenta de nuevo.' 
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
                    <div className="auth-header-container">
                        <div className="flex-center mb-4">
                            <div className="auth-logo-icon">
                                <BrainCircuit size={32} />
                            </div>
                        </div>
                        <h2 className="auth-title">
                            Recuperar Acceso
                        </h2>
                        <p className="auth-subtitle">
                            {step === 1 && "Ingresa tu teléfono o correo para recibir un código por WhatsApp"}
                            {step === 2 && "Ingresa el código que recibiste por WhatsApp"}
                            {step === 3 && "Contraseña restablecida correctamente"}
                        </p>
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
                            marginBottom: '1rem'
                        }}>
                            <AlertCircle size={18} />
                            {message.text}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleRequestCode} className="fade-in">
                            <div className="input-group">
                                <label className="auth-input-label">Número de Teléfono (WhatsApp) o Correo</label>
                                <div style={{ position: 'relative' }}>
                                    <div className="auth-input-icon">
                                        <Phone size={18} />
                                    </div>
                                    <input 
                                        className="input-field auth-input-field"
                                        type="text"
                                        placeholder="+584120000000 o usuario@institucion.edu"
                                        value={phoneOrEmail}
                                        onChange={(e) => setPhoneOrEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full auth-btn-submit" 
                                disabled={loading}
                            >
                                {loading ? <RefreshCw className="spin" size={20} /> : 'Enviar Código por WhatsApp'}
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="fade-in">
                            <div className="input-group">
                                <label className="auth-input-label">Código Numérico (6 dígitos)</label>
                                <div style={{ position: 'relative' }}>
                                    <div className="auth-input-icon">
                                        <Key size={18} />
                                    </div>
                                    <input 
                                        className="input-field auth-input-field"
                                        type="text"
                                        placeholder="123456"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                                        required
                                        style={{ letterSpacing: '0.2rem', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>
                            
                            <div className="input-group">
                                <label className="auth-input-label">Nueva Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <div className="auth-input-icon">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        className="input-field auth-input-field"
                                        type="password"
                                        placeholder="Crea una contraseña segura"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full auth-btn-submit" 
                                disabled={loading || code.length < 6}
                            >
                                {loading ? <RefreshCw className="spin" size={20} /> : 'Confirmar y Cambiar'}
                            </Button>
                            
                            <Button 
                                variant="ghost" 
                                className="w-full mt-2" 
                                onClick={() => setStep(1)}
                                type="button"
                                style={{ marginTop: '0.5rem' }}
                            >
                                Ingresar otro teléfono
                            </Button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="fade-in" style={{ textAlign: 'center', padding: '0.5rem 0' }}>
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
                                {message?.text || "Tu contraseña ha sido restablecida con éxito."}
                            </p>
                            <Button className="w-full auth-btn-submit" onClick={() => navigate('/login')} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>
                                Ir a Iniciar Sesión
                            </Button>
                        </div>
                    )}

                    {step < 3 && (
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
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PasswordRecovery;
