import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div className="container">Cargando perfil...</div>;

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <Link to="/dashboard" className="back-link">
                <ArrowLeft size={16} /> Volver al Panel
            </Link>

            <div className="card animate-fade-up" style={{ padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'var(--brand-indigo-soft)', color: 'var(--brand-indigo)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem', border: '2px solid var(--brand-indigo-soft)'
                    }}>
                        <User size={40} />
                    </div>
                    <h2 style={{ fontSize: 'var(--text-xl)', margin: '0 0 0.5rem 0' }}>{user.nombres} {user.apellidos}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Estudiante de EduLógica</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '1rem', borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)'
                    }}>
                        <div style={{ color: 'var(--brand-indigo)' }}><Mail size={18} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Correo Electrónico</div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{user.correo}</div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '1rem', borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)'
                    }}>
                        <div style={{ color: 'var(--brand-indigo)' }}><Shield size={18} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Identificación (Cédula)</div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{user.cedula}</div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '1rem', borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)'
                    }}>
                        <div style={{ color: 'var(--brand-indigo)' }}><Calendar size={18} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Estado de Cuenta</div>
                            <div style={{ color: 'var(--semantic-success)', fontWeight: '600' }}>Activa</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '2.5rem', paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-subtle)', textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                        Los datos de tu perfil son gestionados por la administración central.
                        Para cambios, contacta a soporte técnico.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
