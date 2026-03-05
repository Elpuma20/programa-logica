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
        semestre: '',
        area_estudios: '',
        correo: '',
        telefono: '',
        direccion: '',
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
            <div className="card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2>Crear Cuenta</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Regístrate para acceder a la plataforma</p>
                </div>

                {error && (
                    <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Cédula</label>
                            <input
                                className="input-field"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
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
                        <div className="form-group">
                            <label>Nombres</label>
                            <input
                                className="input-field"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos</label>
                            <input
                                className="input-field"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Semestre</label>
                            <input
                                className="input-field"
                                name="semestre"
                                value={formData.semestre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Área de Estudios</label>
                            <input
                                className="input-field"
                                name="area_estudios"
                                value={formData.area_estudios}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                className="input-field"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                className="input-field"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
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

                    <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '1.5rem' }}>
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
