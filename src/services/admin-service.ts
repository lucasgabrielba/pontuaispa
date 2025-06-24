import api from '@/lib/api'

export const adminService = {
  // Obter atividades recentes do sistema
  getRecentActivities: (params?: {
    limit?: number
    type?: string
    severity?: 'info' | 'warning' | 'error' | 'success'
  }) => api.get('/admin/activities/recent', { params }),

  // Obter estatísticas gerais do sistema
  getStats: () => api.get('/admin/stats'),

  // Obter lista de usuários com paginação
  getUsers: (params?: {
    page?: number
    per_page?: number
    search?: string
    status?: 'Ativo' | 'Inativo' | 'all'
    sort_by?: 'name' | 'email' | 'created_at' | 'last_login'
    sort_order?: 'asc' | 'desc'
  }) => api.get('/admin/usuarios', { params }),

  // Obter detalhes de um usuário específico
  getUserDetails: (userId: string) => api.get(`/admin/usuarios/${userId}`),

  // Atualizar status de usuário
  updateUserStatus: (userId: string, status: 'Ativo' | 'Inativo') => 
    api.patch(`/admin/usuarios/${userId}/status`, { status }),

  // Obter faturas pendentes
  getPendingInvoices: (params?: {
    page?: number
    per_page?: number
    priority?: 'low' | 'medium' | 'high' | 'all'
    status?: 'pending' | 'processing' | 'error' | 'all'
    sort_by?: 'upload_date' | 'amount' | 'wait_time' | 'priority'
    sort_order?: 'asc' | 'desc'
  }) => api.get('/admin/invoices/pending', { params }),

  // Reprocessar fatura com erro
  reprocessInvoice: (invoiceId: string) => 
    api.post(`/admin/invoices/${invoiceId}/reprocess`),

  // Priorizar processamento de fatura
  prioritizeInvoice: (invoiceId: string, priority: 'low' | 'medium' | 'high') =>
    api.patch(`/admin/invoices/${invoiceId}/priority`, { priority }),

  // Obter saúde do sistema
  getSystemHealth: () => api.get('/admin/system/health'),

  // Obter logs do sistema
  getSystemLogs: (params?: {
    level?: 'info' | 'warning' | 'error' | 'all'
    service?: string
    start_date?: string
    end_date?: string
    page?: number
    per_page?: number
  }) => api.get('/admin/system/logs', { params }),

  // Obter métricas de performance
  getPerformanceMetrics: (params?: {
    period?: '1h' | '24h' | '7d' | '30d'
    metric_type?: 'response_time' | 'throughput' | 'error_rate' | 'all'
  }) => api.get('/admin/metrics/performance', { params }),

  // Obter relatório de uso da IA
  getAIUsageReport: (params?: {
    start_date?: string
    end_date?: string
    group_by?: 'day' | 'week' | 'month'
  }) => api.get('/admin/ai/usage-report', { params }),

  // Configurações do sistema
  getSystemSettings: () => api.get('/admin/settings'),

  updateSystemSettings: (settings: {
    max_invoice_size?: number
    processing_timeout?: number
    ai_model_version?: string
    maintenance_mode?: boolean
    rate_limit_per_user?: number
  }) => api.put('/admin/settings', settings),

  // Backup e manutenção
  initiateBackup: () => api.post('/admin/backup/initiate'),

  getBackupStatus: () => api.get('/admin/backup/status'),

  // Notificações administrativas
  getAdminNotifications: () => api.get('/admin/notifications'),

  markNotificationAsRead: (notificationId: string) => 
    api.patch(`/admin/notifications/${notificationId}/read`),

  // Relatórios administrativos
  generateReport: (reportType: 'users' | 'invoices' | 'performance' | 'ai_usage', params?: {
    start_date?: string
    end_date?: string
    format?: 'json' | 'csv' | 'pdf'
  }) => api.post('/admin/reports/generate', { type: reportType, ...params }),

  downloadReport: (reportId: string) => 
    api.get(`/admin/reports/${reportId}/download`, { responseType: 'blob' }),

  // Auditoria
  getAuditLogs: (params?: {
    user_id?: string
    action_type?: string
    start_date?: string
    end_date?: string
    page?: number
    per_page?: number
  }) => api.get('/admin/audit/logs', { params }),

  // Gestão de cartões e bancos
  getBanksList: () => api.get('/admin/banks'),

  addBank: (bankData: {
    name: string
    code: string
    description?: string
    logo_url?: string
    primary_color?: string
    secondary_color?: string
    is_active: boolean
  }) => api.post('/admin/banks', bankData),

  updateBank: (bankId: string, bankData: any) => 
    api.put(`/admin/banks/${bankId}`, bankData),

  // Gestão de programas de recompensas
  getRewardProgramsList: () => api.get('/admin/reward-programs'),

  addRewardProgram: (programData: {
    name: string
    code: string
    description?: string
    website?: string
    logo_path?: string
  }) => api.post('/admin/reward-programs', programData),

  updateRewardProgram: (programId: string, programData: any) => 
    api.put(`/admin/reward-programs/${programId}`, programData),

  // Monitoramento de filas
  getQueueStatus: () => api.get('/admin/queues/status'),

  // Estatísticas de erros
  getErrorStats: (params?: {
    period?: '1h' | '24h' | '7d' | '30d'
    group_by?: 'hour' | 'day'
  }) => api.get('/admin/errors/stats', { params }),

  // Limpeza de dados
  cleanupOldData: (params: {
    older_than_days: number
    data_type: 'logs' | 'temp_files' | 'failed_jobs' | 'all'
  }) => api.post('/admin/cleanup', params)
}