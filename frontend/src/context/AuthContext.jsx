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
            const mockToken = 'mock-google-token-xyz';
            const mockUser = {
                cedula: '12345678',
                nombres: 'Usuario Google',
                apellidos: 'EduLógica',
                correo: 'usuario.google@gmail.com',
                rol: 'estudiante'
            };
            localStorage.setItem('token', mockToken);
            setToken(mockToken);
            setUser(mockUser);
            setLoading(false);
            return;
        }

        if (token) {
            if (token === 'mock-google-token-xyz') {
                setUser({
                    cedula: '12345678',
                    nombres: 'Usuario Google',
                    apellidos: 'EduLógica',
                    correo: 'usuario.google@gmail.com',
                    rol: 'estudiante'
                });
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
