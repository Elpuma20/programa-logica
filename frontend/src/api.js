import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD
        ? 'https://api.matematicalogica.dev/api'
        : 'http://localhost:8000/api'),
});

export default api;
