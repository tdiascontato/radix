// radix/next-radix/src/app/datas/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const registerUser = async (email, password) => {
    try {
        const response = await api.post('/users/register', { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Registration failed');
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

export const getSensorAverages = async (period) => {
    try {
        const response = await api.get(`/sensors/averages`, {
            params: { period },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Failed to fetch sensor averages');
    }
};

export default api;
