import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, User, Mail, Lock, CreditCard, ChevronLeft, BrainCircuit } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    }, [formData, login, navigate]);

    return (
        <div className="container flex-center" style={{ minHeight: '90vh' }}>
            <Card className="fade-in" style={{ width: '600px', maxWidth: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
                    <h2 className="mb-2">Únete a <span style={{ fontWeight: 900 }}>Edu<span className="text-gradient">Lógica</span></span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Comienza tu viaje en la formación lógica profesional</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        <Input 
                            label="Nombres"
                            name="nombres"
                            placeholder="Nombre completo"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                        />
                        <Input 
                            label="Apellidos"
                            name="apellidos"
                            placeholder="Apellidos completos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        <Input 
                            label="Documento (Cédula)"
                            name="cedula"
                            placeholder="Ej. 12345678"
                            value={formData.cedula}
                            onChange={handleChange}
                            required
                        />
                        <Input 
                            label="Correo Institucional"
                            name="correo"
                            type="email"
                            placeholder="usuario@edu"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input 
                        label="Contraseña"
                        name="password"
                        type="password"
                        placeholder="Crea una contraseña segura"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {error && (
                        <div className="fade-in" style={{ 
                            padding: '1rem', 
                            borderRadius: '12px', 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            color: '#ef4444',
                            fontSize: '0.85rem',
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            whiteSpace: 'pre-line'
                        }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                        style={{ height: '3.5rem' }}
                    >
                        {isSubmitting ? 'Procesando...' : 'Crear Cuenta Estudiantil'}
                    </Button>
                </form>

                <div style={{ 
                    marginTop: '2rem', 
                    textAlign: 'center', 
                    paddingTop: '1.5rem', 
                    borderTop: '1px solid var(--border-default)' 
                }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none' }}>
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;
