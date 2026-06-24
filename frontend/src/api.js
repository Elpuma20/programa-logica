import axios from 'axios';

let url = import.meta.env.VITE_API_URL;

// Discard legacy/inactive Render URLs if configured in Vercel env vars
if (!url || url.includes('edulogica-backend-95p9.onrender.com') || url.includes('edulogica-backend-05p9.onrender.com')) {
    url = import.meta.env.PROD
        ? 'https://backend-edulogica.onrender.com/api'
        : 'http://127.0.0.1:8000/api';
}

const api = axios.create({
    baseURL: url,
});

export default api;
