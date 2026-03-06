import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        cedula: '',
        nombres: '',
        apellidos: '',
        correo: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:8000/api/register/', formData);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            if (err.response && err.response.data) {
                const errors = err.response.data;
                if (typeof errors === 'object' && errors !== null) {
                    const errorMessages = Object.keys(errors).map(key => {
                        const label = key.charAt(0).toUpperCase() + key.slice(1);
                        return `${label}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`;
                    }).join(' | ');
                    setError(`Error: ${errorMessages}`);
                } else {
                    setError(`Error: ${errors}`);
                }
            } else {
                setError('Error al conectar con el servidor. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <div className="card card-animated" style={{ padding: '2.5rem', maxWidth: '500px', margin: '0 auto', borderRadius: '12px' }}>


                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="logo" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Edu<span>Lógica</span></div>
                    <h2>Crear Cuenta</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Regístrate para acceder a la plataforma</p>
                </div>

                {error && (
                    <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="form-group stagger-item">
                            <label>Cédula</label>
                            <input
                                className="input-field"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group stagger-item">
                            <label>Correo Electrónico</label>
                            <input
                                className="input-field"
                                name="correo"
                                type="email"
                                value={formData.correo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group stagger-item">
                            <label>Nombres</label>
                            <input
                                className="input-field"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group stagger-item">
                            <label>Apellidos</label>
                            <input
                                className="input-field"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group stagger-item">
                            <label>Contraseña</label>
                            <input
                                className="input-field"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button className="btn-primary stagger-item" type="submit" style={{ width: '100%', marginTop: '1.5rem' }}>
                        <UserPlus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Registrarse
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    ¿Ya tienes cuenta? <Link to="/login" className="link">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
