// lib/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9000', // La URL de tu backend NestJS
});

export default api;