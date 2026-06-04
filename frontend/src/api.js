import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://edulogica-backend-05p9.onrender.com/api'
        : 'http://localhost:8000/api',
});

export default api;
