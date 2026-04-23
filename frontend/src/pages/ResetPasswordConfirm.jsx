import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { 
    BrainCircuit, ArrowLeft, Lock, 
    CheckCircle, AlertCircle, RefreshCw 
} from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams();
    const [formData, setFormData] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

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
            setMessage({ type: 'success', text: res.data.success });
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
                    <h2 className="mb-2">Nueva <span className="text-gradient">Contraseña</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ingresa tu nueva clave maestra</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <Input 
                            label="Nueva Contraseña"
                            name="new_password"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={formData.new_password}
                            onChange={handleChange}
                            icon={<Lock size={18} />}
                            required
                        />

                        <Input 
                            label="Confirmar Nueva Contraseña"
                            name="confirm_password"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            icon={<Lock size={18} />}
                            required
                        />

                        {message && (
                            <div className="fade-in" style={{ 
                                padding: '1rem', 
                                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                color: message.type === 'success' ? '#10b981' : '#ef4444', 
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                            }}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading}
                            style={{ height: '3.5rem' }}
                        >
                            {loading ? <RefreshCw className="spin" size={20} /> : 'Actualizar Contraseña'}
                        </Button>
                    </div>
                </form>

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

export default ResetPasswordConfirm;
