import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // Importante para o Sanctum - permite enviar cookies cross-domain
})

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    // Adiciona um cabeçalho de autorização se o token estiver disponível
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Tratar erros específicos
    if (error.response?.status === 401) {
      // Limpar autenticação se receber 401 Unauthorized
      useAuthStore.getState().auth.reset()
    }
    return Promise.reject(error)
  }
)

// API wrapper para adicionar o prefixo da API em todas as chamadas
const apiClient = {
  get: (url: string, config = {}) => api.get(`${apiPrefix}${url}`, config),
  post: (url: string, data = {}, config = {}) => api.post(`${apiPrefix}${url}`, data, config),
  put: (url: string, data = {}, config = {}) => api.put(`${apiPrefix}${url}`, data, config),
  patch: (url: string, data = {}, config = {}) => api.patch(`${apiPrefix}${url}`, data, config),
  delete: (url: string, config = {}) => api.delete(`${apiPrefix}${url}`, config),
  
  // Métodos especiais para Sanctum
  csrf: () => api.get('/sanctum/csrf-cookie'),
  baseUrl: baseURL
}

export default apiClient