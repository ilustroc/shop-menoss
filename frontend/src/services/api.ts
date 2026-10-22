import axios from 'axios'

// En Docker/Nginx se usa /api. En Vite local, conserva el puerto original.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api'),
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
