import api from '@/lib/api'

export const authService = {
  // Obter cookie CSRF
  getCsrfCookie: () => api.csrf(),
  
  // Login
  login: async (credentials: { email: string; password: string }) => {
    await api.csrf()
    return api.post('/auth/login', credentials)
  },
  
  // Registro
  register: async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    await api.csrf()
    return api.post('/auth/register', userData)
  },
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Buscar usuário autenticado
  getUser: () => api.get('/auth/user'),
  
  // Verificar se está autenticado
  check: () => api.get('/auth/check')
}