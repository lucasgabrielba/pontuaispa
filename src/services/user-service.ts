import api from '@/lib/api'

export const userService = {
  getAll: (params?: any) => api.get('/usuarios', { params }),
  getById: (id: number) => api.get(`/usuarios/${id}`),
  create: (data: any) => api.post('/usuarios', data),
  update: (id: number, data: any) => api.put(`/usuarios/${id}`, data),
  delete: (id: number) => api.delete(`/usuarios/${id}`)
}