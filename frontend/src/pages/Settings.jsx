import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
    ArrowLeft, Save, AlertCircle, CheckCircle, 
    User, Mail, Shield, Lock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const SettingsPage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombres: user?.nombres || '',
        apellidos: user?.apellidos || '',
        correo: user?.correo || ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [pwdData, setPwdData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [pwdMessage, setPwdMessage] = useState(null);
    const [pwdLoading, setPwdLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(null);
    };

    const handlePwdChange = (e) => {
        setPwdData({ ...pwdData, [e.target.name]: e.target.value });
        setPwdMessage(null);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (pwdData.new_password !== pwdData.confirm_password) {
            setPwdMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
            return;
        }
        setPwdLoading(true);
        try {
            await api.post('/change-password/', {
                old_password: pwdData.old_password,
                new_password: pwdData.new_password
            });
            setPwdMessage({ type: 'success', text: 'Contraseña actualizada con éxito.' });
            setPwdData({ old_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            setPwdMessage({ type: 'error', text: err.response?.data?.error || 'Error al cambiar la contraseña.' });
        } finally {
            setPwdLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        
        try {
            const res = await api.patch('/user/', formData);
            // Updating the local user context
            login(localStorage.getItem('token'), res.data);
            setMessage({ type: 'success', text: 'Perfil actualizado con éxito.' });
            setTimeout(() => navigate('/perfil'), 1500);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error al actualizar el perfil. Revisa los datos.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '600px' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/perfil" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary"><ArrowLeft size={16} /> Volver</Button>
                </Link>
                <div style={{ textAlign: 'right' }}>
                    <h2 className="text-gradient" style={{ margin: 0 }}>Configuración</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Gstiona tus credenciales de agente</p>
                </div>
            </header>

            <form onSubmit={handleSubmit}>
                <Card style={{ borderTop: '4px solid var(--brand-primary)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                <User size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Nombres
                            </label>
                            <input 
                                type="text" 
                                name="nombres"
                                className="input-field"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                <User size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Apellidos
                            </label>
                            <input 
                                type="text" 
                                name="apellidos"
                                className="input-field"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                <Mail size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Correo Electrónico
                            </label>
                            <input 
                                type="email" 
                                name="correo"
                                className="input-field"
                                value={formData.correo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-default)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                <Lock size={16} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cambiar Contraseña</span>
                                <Badge variant="primary" style={{ fontSize: '0.6rem', marginLeft: 'auto' }}>Módulo de Seguridad</Badge>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>CONTRASEÑA ACTUAL</label>
                                    <input 
                                        type="password" 
                                        name="old_password"
                                        className="input-field"
                                        value={pwdData.old_password}
                                        onChange={handlePwdChange}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>NUEVA</label>
                                        <input 
                                            type="password" 
                                            name="new_password"
                                            className="input-field"
                                            value={pwdData.new_password}
                                            onChange={handlePwdChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>CONFIRMAR</label>
                                        <input 
                                            type="password" 
                                            name="confirm_password"
                                            className="input-field"
                                            value={pwdData.confirm_password}
                                            onChange={handlePwdChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                
                                {pwdMessage && (
                                    <div className="fade-in" style={{ 
                                        padding: '0.8rem', 
                                        background: pwdMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                        color: pwdMessage.type === 'success' ? '#10b981' : '#ef4444', 
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                    }}>
                                        {pwdMessage.text}
                                    </div>
                                )}

                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={handlePasswordSubmit} 
                                    disabled={pwdLoading}
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    {pwdLoading ? 'Procesando...' : 'Actualizar Contraseña'}
                                </Button>
                            </div>
                        </div>

                        {message && (
                            <div className="fade-in" style={{ 
                                padding: '1rem', 
                                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                color: message.type === 'success' ? '#10b981' : '#ef4444', 
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.9rem',
                                fontWeight: 700
                            }}>
                                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                            {loading ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default SettingsPage;
