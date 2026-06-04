import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff, User, Lock, ArrowRight, ShieldCheck, Mail, CreditCard, BrainCircuit, Instagram, Facebook } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const backgrounds = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg'
];

const WhatsAppIcon = ({ size = 20, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const socialLinks = [
    {
        name: 'WhatsApp',
        icon: WhatsAppIcon,
        url: 'https://wa.me/',
        color: '#25D366',
        hoverBg: 'rgba(37, 211, 102, 0.1)'
    },
    {
        name: 'Instagram',
        icon: Instagram,
        url: 'https://www.instagram.com/aisunergoficial?igsh=c3dpbThkYTZ2ZHU2',
        color: '#E4405F',
        hoverBg: 'rgba(228, 64, 95, 0.1)'
    },
    {
        name: 'Facebook',
        icon: Facebook,
        url: 'https://facebook.com/',
        color: '#1877F2',
        hoverBg: 'rgba(24, 119, 242, 0.1)'
    }
];

const Login = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [loginCorreo, setLoginCorreo] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [regNombre, setRegNombre] = useState('');
    const [regCedula, setRegCedula] = useState('');
    const [regCorreo, setRegCorreo] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [tempUserId, setTempUserId] = useState(null);
    const [tempEmail, setTempEmail] = useState('');

    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [currentBg, setCurrentBg] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGoogleLogin = useCallback(() => {
        // REEMPLAZA EL VALOR DE ABAJO CON TU CLIENT ID OBTENIDO DE GOOGLE CLOUD
        const clientId = '20002938503-ek8tp28lunnho7014vni06unk4k739rb.apps.googleusercontent.com';

        const redirectUri = `${window.location.origin}/dashboard`;
        const scope = 'email profile';
        const responseType = 'token';

        sessionStorage.setItem('google_login_pending', 'true');

        const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
        window.location.href = oauthUrl;
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLoginSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/login/', { correo: loginCorreo, password: loginPassword });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.non_field_errors?.[0] || 'Credenciales no autorizadas. Verifique su acceso.');
        }
    }, [loginCorreo, loginPassword, login, navigate]);

    const handleRegisterSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');

        if (regPassword !== regConfirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        const nameParts = regNombre.trim().split(' ');
        const nombres = nameParts[0] || '';
        const apellidos = nameParts.slice(1).join(' ') || '.';

        setIsSubmitting(true);
        try {
            const formData = {
                cedula: regCedula,
                nombres: nombres,
                apellidos: apellidos,
                correo: regCorreo,
                password: regPassword,
            };
            const res = await api.post('/register/', formData);
            setTempUserId(res.data.user_id);
            setTempEmail(res.data.email);
            setIsVerifying(true);
            if (res.data.code) {
                setVerificationCode(res.data.code);
            }
        } catch (err) {
            if (err.response?.data) {
                const errors = err.response.data;
                if (typeof errors === 'object' && errors !== null) {
                    const errorMessages = Object.keys(errors).map(key => {
                        const message = Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key];
                        return `${key.toUpperCase()}: ${message}`;
                    }).join('\n');
                    setError(errorMessages);
                } else {
                    setError(String(errors));
                }
            } else {
                setError('Error en el registro. Verifique sus datos.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [regNombre, regCedula, regCorreo, regPassword, regConfirm]);

    const handleVerifyCode = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/verify-code/', {
                user_id: tempUserId,
                code: verificationCode
            });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Código incorrecto. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    }, [tempUserId, verificationCode, login, navigate]);

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
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
                    width: isVerifying || !isLoginMode ? '480px' : '420px',
                    maxWidth: '95%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '2.5rem',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>

                    {isVerifying ? (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div className="flex-center mb-4">
                                    <div style={{ width: 64, height: 64, background: '#2563eb', borderRadius: '18px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ShieldCheck size={32} />
                                    </div>
                                </div>
                                <h2 style={{ color: '#2563eb', fontSize: '1.75rem', fontWeight: 800 }}>Verifica tu Cuenta</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>Hemos enviado un código a {tempEmail}</p>
                            </div>
                            <form onSubmit={handleVerifyCode}>
                                <div className="input-group">
                                    <input
                                        className="input-field"
                                        placeholder="000000"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                                        required
                                        style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 800, background: 'rgba(255,255,255,0.8)' }}
                                    />
                                </div>
                                {error && (
                                    <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}
                                <Button type="submit" className="w-full" disabled={isSubmitting || verificationCode.length < 6} style={{ height: '3.5rem', background: '#2563eb', color: 'white', borderRadius: '8px' }}>
                                    {isSubmitting ? 'Verificando...' : 'Verificar y Entrar'}
                                </Button>
                            </form>
                        </>
                    ) : isLoginMode ? (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <div className="flex-center mb-4">
                                    <div style={{ width: 64, height: 64, background: '#2563eb', borderRadius: '18px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                        <BrainCircuit size={32} />
                                    </div>
                                </div>
                                <h2 className="mb-2" style={{ color: '#2563eb', fontSize: '1.75rem', fontWeight: 800 }}>Iniciar Sesión</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ingresa tus credenciales para acceder</p>
                            </div>
                            <form onSubmit={handleLoginSubmit}>
                                <div className="input-group">
                                    <label className="input-label" style={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#555' }}>Usuario o Correo</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={18} /></div>
                                        <input className="input-field" type="email" placeholder="usuario@ejemplo.com" value={loginCorreo} onChange={(e) => setLoginCorreo(e.target.value)} required style={{ paddingLeft: '2.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)' }} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" style={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#555' }}>Contraseña</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></div>
                                        <input className="input-field" type={showPassword ? "text" : "password"} placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required style={{ paddingLeft: '2.8rem', paddingRight: '2.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)', padding: '4px' }}>
                                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                    </div>
                                </div>
                                {error && (
                                    <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}
                                <Button type="submit" className="w-full" disabled={loading} style={{ height: '3.5rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none', borderRadius: '8px', marginTop: '0.5rem' }}>
                                    {loading ? 'Cargando...' : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Iniciar Sesión <ArrowRight size={18} style={{ marginLeft: '8px' }} /></span>}
                                </Button>

                                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                                    <span style={{ padding: '0 1rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>O continuar con</span>
                                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                                </div>

                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={handleGoogleLogin}
                                    style={{
                                        height: '3.5rem',
                                        background: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </Button>

                            </form>
                            <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <Link to="/recuperar" style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    ¿No tienes cuenta? <span onClick={toggleMode} style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Regístrate aquí</span>
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Nuestras redes sociales</span>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={social.name}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: social.hoverBg,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: social.color,
                                                border: `1px solid ${social.color}22`,
                                                transition: 'all 0.2s ease',
                                                textDecoration: 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = social.color;
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = social.hoverBg;
                                                e.currentTarget.style.color = social.color;
                                            }}
                                        >
                                            <social.icon size={16} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <div className="flex-center mb-4">
                                    <div style={{ width: 64, height: 64, background: '#2563eb', borderRadius: '18px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                        <BrainCircuit size={32} />
                                    </div>
                                </div>
                                <h2 className="mb-2" style={{ color: '#2563eb', fontSize: '1.75rem', fontWeight: 800 }}>Crear Cuenta</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Únete para comenzar tu aprendizaje</p>
                            </div>
                            <form onSubmit={handleRegisterSubmit}>
                                <div className="input-group">
                                    <label className="input-label" style={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#555' }}>Nombre Completo</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={18} /></div>
                                        <input className="input-field" type="text" placeholder="Ej. Juan Pérez" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} required style={{ paddingLeft: '2.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)' }} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" style={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#555' }}>Cédula</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><CreditCard size={18} /></div>
                                        <input className="input-field" type="text" placeholder="Ej. 12345678" value={regCedula} onChange={(e) => setRegCedula(e.target.value)} required style={{ paddingLeft: '2.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)' }} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" style={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#555' }}>Correo Electrónico</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Mail size={18} /></div>
                                        <input className="input-field" type="email" placeholder="usuario@edu" value={regCorreo} onChange={(e) => setRegCorreo(e.target.value)} required style={{ paddingLeft: '2.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)' }} />
                                    </div>
                                </div>
                                <div className="auth-password-grid">
                                    <div className="input-group">
                                        <label className="input-label" style={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#555' }}>Contraseña</label>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></div>
                                            <input className="input-field" type={showPassword ? "text" : "password"} placeholder="••••••••" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required style={{ paddingLeft: '2.8rem', paddingRight: '2.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)' }} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)', padding: '4px' }}>
                                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label" style={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#555' }}>Confirmar</label>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></div>
                                            <input className="input-field" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} required style={{ paddingLeft: '2.8rem', paddingRight: '2.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.8)' }} />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)', padding: '4px' }}>
                                                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {error && (
                                    <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}
                                <Button type="submit" className="w-full" disabled={isSubmitting} style={{ height: '3.5rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none', borderRadius: '8px', marginTop: '0.5rem' }}>
                                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                                </Button>
                            </form>
                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    ¿Ya tienes cuenta? <span onClick={toggleMode} style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Inicia sesión aquí</span>
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Nuestras redes sociales</span>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={social.name}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: social.hoverBg,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: social.color,
                                                border: `1px solid ${social.color}22`,
                                                transition: 'all 0.2s ease',
                                                textDecoration: 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = social.color;
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = social.hoverBg;
                                                e.currentTarget.style.color = social.color;
                                            }}
                                        >
                                            <social.icon size={16} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Login;
