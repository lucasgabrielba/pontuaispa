import api from '@/lib/api'

export const adminService = {
  // Obter atividades recentes do sistema
  getRecentActivities: (params = {}) => 
    api.get('/admin/activities/recent', { params }),

  // Obter estatísticas gerais do sistema
  getStats: () => 
    api.get('/admin/stats'),

  // Obter lista de usuários com paginação
  getUsers: (params = {}) => 
    api.get('/admin/users', { params }),

  // Obter detalhes de um usuário específico
  getUserDetails: (userId: string) => 
    api.get(`/admin/users/${userId}`),

  // Atualizar status de usuário
  updateUserStatus: (userId: string, status: string) => 
    api.patch(`/admin/users/${userId}/status`, { status }),

  // Obter faturas pendentes
  getPendingInvoices: (params = {}) => 
    api.get('/admin/invoices/pending', { params }),

  // Reprocessar fatura com erro
  reprocessInvoice: (invoiceId: string) => 
    api.post(`/admin/invoices/${invoiceId}/reprocess`),

  // Priorizar processamento de fatura
  prioritizeInvoice: (invoiceId: string, priority: string) =>
    api.patch(`/admin/invoices/${invoiceId}/priority`, { priority }),

  // Obter saúde do sistema
  getSystemHealth: () => 
    api.get('/admin/system/health'),

  // Obter logs do sistema
  getSystemLogs: (params = {}) => 
    api.get('/admin/system/logs', { params }),

  // Obter métricas de performance
  getPerformanceMetrics: (params = {}) => 
    api.get('/admin/metrics/performance', { params }),

  // Obter relatório de uso da IA
  getAIUsageReport: (params = {}) => 
    api.get('/admin/ai/usage-report', { params }),

  // Configurações do sistema
  getSystemSettings: () => 
    api.get('/admin/settings'),

  updateSystemSettings: (settings: any) => 
    api.put('/admin/settings', settings),

  // Backup e manutenção
  initiateBackup: () => 
    api.post('/admin/backup/initiate'),

  getBackupStatus: () => 
    api.get('/admin/backup/status'),

  // Notificações administrativas
  getAdminNotifications: () => 
    api.get('/admin/notifications'),

  markNotificationAsRead: (notificationId: string) => 
    api.patch(`/admin/notifications/${notificationId}/read`),

  // Relatórios administrativos
  generateReport: (reportType: string, params = {}) => 
    api.post('/admin/reports/generate', { type: reportType, ...params }),

  downloadReport: (reportId: string) => 
    api.get(`/admin/reports/${reportId}/download`, { responseType: 'blob' }),

  // Auditoria
  getAuditLogs: (params = {}) => 
    api.get('/admin/audit/logs', { params }),

  // Gestão de cartões e bancos
  getBanksList: () => 
    api.get('/admin/banks'),

  addBank: (bankData: any) => 
    api.post('/admin/banks', bankData),

  updateBank: (bankId: string, bankData: any) => 
    api.put(`/admin/banks/${bankId}`, bankData),

  // Gestão de programas de recompensas
  getRewardProgramsList: () => 
    api.get('/admin/reward-programs'),

  addRewardProgram: (programData: any) => 
    api.post('/admin/reward-programs', programData),

  updateRewardProgram: (programId: string, programData: any) => 
    api.put(`/admin/reward-programs/${programId}`, programData),

  // Monitoramento de filas
  getQueueStatus: () => 
    api.get('/admin/queues/status'),

  // Estatísticas de erros
  getErrorStats: (params = {}) => 
    api.get('/admin/errors/stats', { params }),

  // Limpeza de dados
  cleanupOldData: (params: any) => 
    api.post('/admin/cleanup', params)
}