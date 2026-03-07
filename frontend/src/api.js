import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://edulogica.onrender.com/api'
        : 'http://localhost:8000/api',
});

export default api;
