import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000', // Tu URL del backend
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
        console.log("🔄 Token vencido. Intentando renovar...");
        
        // 1. Llamamos al endpoint de renovación usando el token de NESTJS (que dura más)
        const appToken = localStorage.getItem("token"); // Tu JWT de la app
        
        // Usamos una instancia nueva de axios para no pasar por el interceptor otra vez
        await axios.post('http://localhost:9000/auth/refresh-spotify', {}, {
            headers: { Authorization: `Bearer ${appToken}` }
        });

        console.log("✅ Token renovado. Reintentando petición...");
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