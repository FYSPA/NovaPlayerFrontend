import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true,
});

// 1. INTERCEPTOR DE SOLICITUD (Para inyectar el token siempre)
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- LÓGICA DEL SEMÁFORO ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. INTERCEPTOR DE RESPUESTA (Manejo de errores)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no hemos reintentado ya esta petición
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // CASO A: Ya hay alguien renovando. ¡A LA FILA!
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
        }).then(() => {
            // Cuando se resuelva la promesa, reintentamos la petición original
            return api(originalRequest);
        }).catch(err => {
            return Promise.reject(err);
        });
      }

      // CASO B: Soy el primero. INICIO LA RENOVACIÓN.
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const appToken = localStorage.getItem("token");
        
        // Llamada de renovación (usamos axios puro para evitar bucles)
        await axios.post(`${BASE_URL}/auth/refresh-spotify`, {}, {
            headers: { Authorization: `Bearer ${appToken}` }
        });

        // ¡Éxito! Liberamos el semáforo y procesamos la fila
        isRefreshing = false;
        processQueue(null, 'success');

        // Reintentamos la petición original
        return api(originalRequest);

      } catch (refreshError) {
        // Falló todo. Rechazamos a todos en la fila y cerramos sesión.
        processQueue(refreshError, null);
        isRefreshing = false;
        
        console.error("❌ Sesión caducada. Redirigiendo...", refreshError);
        localStorage.removeItem("token");
        window.location.href = "/login";
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;