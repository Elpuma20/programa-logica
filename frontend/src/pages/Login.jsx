import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

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
            setError(err.response?.data?.non_field_errors?.[0] || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
    }, [correo, password, login, navigate]);

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
            <div className="card animate-fade-up" style={{ width: '450px', maxWidth: '95%', padding: '3rem', border: '1px solid var(--border-default)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.0rem' }}>
                    <div className="logo" style={{ fontSize: '1.75rem', justifyContent: 'center', marginBottom: '0.5rem' }}>Edu<span>Lógica</span></div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Identificación de Usuario</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="nombre@ejemplo.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
                        {loading ? 'Procesando...' : (
                            <>
                                <LogIn size={18} style={{ marginRight: '8px' }} /> Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" style={{ color: 'var(--brand-indigo)', fontWeight: '600', textDecoration: 'none' }}>
                        Registrar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
