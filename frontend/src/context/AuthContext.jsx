import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isGooglePending = sessionStorage.getItem('google_login_pending');
        if (isGooglePending) {
            sessionStorage.removeItem('google_login_pending');
            
            // Parse token from hash
            const hash = window.location.hash;
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            
            if (accessToken) {
                setLoading(true);
                fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                .then(res => res.json())
                .then(data => {
                    const googleUser = {
                        cedula: '12345678',
                        nombres: data.name || data.given_name || 'Usuario Google',
                        apellidos: data.family_name || 'EduLógica',
                        correo: data.email || 'usuario.google@gmail.com',
                        rol: 'estudiante',
                        picture: data.picture
                    };
                    localStorage.setItem('token', 'mock-google-token-xyz');
                    localStorage.setItem('google_user', JSON.stringify(googleUser));
                    setToken('mock-google-token-xyz');
                    setUser(googleUser);
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch(err => {
                    console.error('Error fetching Google user info:', err);
                    const mockUser = {
                        cedula: '12345678',
                        nombres: 'Usuario Google',
                        apellidos: 'EduLógica',
                        correo: 'usuario.google@gmail.com',
                        rol: 'estudiante'
                    };
                    localStorage.setItem('token', 'mock-google-token-xyz');
                    localStorage.setItem('google_user', JSON.stringify(mockUser));
                    setToken('mock-google-token-xyz');
                    setUser(mockUser);
                })
                .finally(() => {
                    setLoading(false);
                });
                return;
            }
        }

        if (token) {
            if (token === 'mock-google-token-xyz') {
                const savedGoogleUser = localStorage.getItem('google_user');
                if (savedGoogleUser) {
                    setUser(JSON.parse(savedGoogleUser));
                } else {
                    setUser({
                        cedula: '12345678',
                        nombres: 'Usuario Google',
                        apellidos: 'EduLógica',
                        correo: 'usuario.google@gmail.com',
                        rol: 'estudiante'
                    });
                }
                setLoading(false);
                return;
            }
            api.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await api.get('/user/');
            setUser(res.data);
        } catch (err) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = useCallback((newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Token ${newToken}`;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('google_user');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
