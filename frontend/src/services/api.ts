import axios from 'axios'
import { session } from './session'

// Nginx en Docker y el proxy de Vite mantienen las peticiones en el mismo origen.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(config => {
  const s = session();
  if (s) config.headers.Authorization = 'Bearer ' + s.token;
  return config;
});
api.interceptors.response.use(r => r, error => {
  const data = error.response?.data;
  error.message = error.response?.status === 401 ?
    (error.config?.url === '/auth/login' ? 'Correo o contraseña incorrectos.' : 'Inicia sesión para continuar.') :
    error.response?.status === 403 ? 'No tienes permisos para esta operación.' :
    (data?.error || (data && typeof data === 'object' ? Object.values(data).join('. ') : null) || 'No se pudo conectar. Intenta nuevamente.');
  return Promise.reject(error);
});
export default api
