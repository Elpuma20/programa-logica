import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Mail, Lock, ShieldCheck, ChevronRight, BrainCircuit } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/login/', { correo, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.non_field_errors?.[0] || 'Credenciales no autorizadas. Verifique su acceso.');
        }
    }, [correo, password, login, navigate]);

    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <Card className="fade-in" style={{ width: '420px', maxWidth: '100%' }}>
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
                    <h2 className="mb-4">Bienvenido a <span style={{ fontWeight: 900 }}>Edu<span className="text-gradient">Lógica</span></span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Correo Institucional"
                        type="email"
                        placeholder="usuario@institucion.edu"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />

                    <Input 
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div className="fade-in" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ 
                                padding: '1rem', 
                                borderRadius: '12px', 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                color: '#ef4444',
                                fontSize: '0.85rem',
                                display: 'flex',
                                gap: '0.5rem',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                marginBottom: '0.75rem'
                            }}>
                                <AlertCircle size={18} /> {error}
                            </div>
                            <Link to="/recuperar" style={{ 
                                display: 'block',
                                textAlign: 'right',
                                color: 'var(--brand-primary)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                            }}>
                                ¿Olvidaste tu contraseña? Recuperar acceso
                            </Link>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                        style={{ height: '3.5rem' }}
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Button>
                </form>

                <div style={{ 
                    marginTop: '2rem', 
                    textAlign: 'center', 
                    paddingTop: '1.5rem', 
                    borderTop: '1px solid var(--border-default)' 
                }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none' }}>
                            Regístrate aquí <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
