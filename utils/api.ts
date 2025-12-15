import axios from 'axios';
console.log("--- DEBUG EN VERCEL ---");
console.log("Valor recibido:", process.env.NEXT_PUBLIC_API_URL);
console.log("-----------------------");
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
const api = axios.create({
  baseURL: BASE_URL, // Tu URL del backend
  withCredentials: true, // Para enviar cookies si es necesario
});

// Variable para evitar bucles infinitos de renovación
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response, // Si todo sale bien, pasa directo
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (Unauthorized) y NO es un intento de renovación que ya falló
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return Promise.reject(error); // Si ya estamos renovando, no spamear
      }

      originalRequest._retry = true; // Marcamos para no entrar en bucle
      isRefreshing = true;

      try {
        
        // 1. Llamamos al endpoint de renovación usando el token de NESTJS (que dura más)
        const appToken = localStorage.getItem("token"); // Tu JWT de la app
        
        // Usamos una instancia nueva de axios para no pasar por el interceptor otra vez
        await axios.post(`${BASE_URL}/auth/refresh-spotify`, {}, {
            headers: { Authorization: `Bearer ${appToken}` }
        });
        isRefreshing = false;

        // 2. Reintentamos la petición original que había fallado
        // Como el token de Spotify se lee del Backend en cada petición, 
        // simplemente reenviar la petición funcionará porque la BD ya tiene el nuevo.
        return api(originalRequest);

      } catch (refreshError) {
        console.error("❌ No se pudo renovar. Cerrando sesión.", refreshError);
        isRefreshing = false;
        
        // Si falla la renovación, ahí sí cerramos sesión
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;