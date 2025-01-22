import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:32773/api', // URL base do backend
});

export default api;