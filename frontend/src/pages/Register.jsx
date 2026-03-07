import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        cedula: '',
        nombres: '',
        apellidos: '',
        correo: '',
        password: '',
        semestre: '',
        area_estudios: '',
        telefono: '',
        direccion: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const res = await api.post('/register/', formData);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.data) {
                const errors = err.response.data;
                if (typeof errors === 'object' && errors !== null) {
                    const errorMessages = Object.keys(errors).map(key => {
                        const label = key.toUpperCase();
                        const message = Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key];
                        return `${label}: ${message}`;
                    }).join(' | ');
                    setError(errorMessages);
                } else {
                    setError(String(errors));
                }
            } else {
                setError('ERROR: No se pudo conectar con el servidor.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, login, navigate]);

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
            <div className="card animate-fade-up" style={{ width: '100%', maxWidth: '480px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="logo" style={{ fontSize: '1.75rem', justifyContent: 'center', marginBottom: '0.5rem' }}>Edu<span>Lógica</span></div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Registro de Nuevo Estudiante</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombres"
                                className="input-field"
                                placeholder="Escribe tu nombre"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="apellidos"
                                className="input-field"
                                placeholder="Escribe tu apellido"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Cédula de Identidad</label>
                        <input
                            type="text"
                            name="cedula"
                            className="input-field"
                            placeholder="Número de documento"
                            value={formData.cedula}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            className="input-field"
                            placeholder="nombre@ejemplo.com"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="error-message" style={{ marginBottom: '1.25rem' }}>{error}</div>}

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Procesando...' : 'Completar Registro'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" style={{ color: 'var(--brand-indigo)', fontWeight: '600', textDecoration: 'none' }}>
                        Acceder
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
