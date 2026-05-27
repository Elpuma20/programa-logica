import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleSignIn = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [customEmail, setCustomEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSelectAccount = (email, name) => {
        setLoading(true);
        setTimeout(() => {
            const mockUser = {
                cedula: '12345678',
                nombres: name,
                apellidos: 'EduLógica',
                correo: email,
                rol: 'estudiante'
            };
            login('mock-google-token-xyz', mockUser);
            navigate('/dashboard');
        }, 1200);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            color: '#202124',
            fontFamily: 'Roboto, Arial, sans-serif'
        }}>
            <div style={{
                width: '450px',
                border: '1px solid #dadce0',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Google Linear Loading Bar */}
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: '#f1f3f4',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '40%',
                            height: '100%',
                            background: '#1a73e8',
                            animation: 'googleLoading 1.5s infinite linear',
                            borderRadius: '2px'
                        }} />
                    </div>
                )}

                <style>{`
                    @keyframes googleLoading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(250%); }
                    }
                `}</style>

                {/* Google Logo */}
                <svg width="48" height="48" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>

                <h1 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 8px 0', color: '#202124' }}>
                    {step === 1 ? 'Elige una cuenta' : 'Iniciar sesión'}
                </h1>
                <p style={{ fontSize: '16px', color: '#5f6368', margin: '0 0 24px 0' }}>
                    para continuar en <span style={{ fontWeight: 600, color: '#202124' }}>EduLógica</span>
                </p>

                {step === 1 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        {[
                            { name: 'jr7311300', email: 'jr7311300@gmail.com', avatar: 'J' },
                            { name: 'Invitado Especial', email: 'invitado.logic@gmail.com', avatar: 'I' }
                        ].map((acc, index) => (
                            <div 
                                key={index}
                                onClick={() => !loading && handleSelectAccount(acc.email, acc.name)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: '1px solid #dadce0',
                                    cursor: loading ? 'default' : 'pointer',
                                    gap: '12px'
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: '#1a73e8',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    fontSize: '14px'
                                }}>{acc.avatar}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#3c4043' }}>{acc.name}</div>
                                    <div style={{ fontSize: '12px', color: '#5f6368' }}>{acc.email}</div>
                                </div>
                            </div>
                        ))}

                        <div 
                            onClick={() => !loading && setStep(2)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '16px 0 12px 0',
                                cursor: loading ? 'default' : 'pointer',
                                gap: '12px',
                                color: '#1a73e8'
                            }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#f1f3f4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: '18px',
                                color: '#3c4043'
                            }}>+</div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>Usar otra cuenta</div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (customEmail.trim() && !loading) {
                            const part = customEmail.split('@')[0];
                            const name = part.charAt(0).toUpperCase() + part.slice(1);
                            handleSelectAccount(customEmail, name);
                        }
                    }} style={{ textAlign: 'left' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <input 
                                type="email"
                                required
                                placeholder="Correo electrónico o teléfono"
                                value={customEmail}
                                onChange={(e) => setCustomEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '1px solid #dadce0',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    color: '#202124',
                                    boxSizing: 'border-box'
                                }}
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button 
                                type="button"
                                onClick={() => setStep(1)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1a73e8',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                                disabled={loading}
                            >
                                Atrás
                            </button>
                            <button 
                                type="submit"
                                style={{
                                    background: '#1a73e8',
                                    border: 'none',
                                    color: '#ffffff',
                                    padding: '10px 24px',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                                disabled={loading}
                            >
                                Siguiente
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default GoogleSignIn;
