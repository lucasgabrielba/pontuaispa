// src/services/admin-invoices-service.ts
import api from '@/lib/api'

export const adminInvoicesService = {
  // Obter lista de usuários com informações de faturas
  getUsers: (params?: {
    page?: number
    per_page?: number
    search?: string
    status?: 'Ativo' | 'Inativo' | 'all'
    has_invoices?: boolean
    sort_by?: 'name' | 'email' | 'invoices_count' | 'last_invoice_date' | 'created_at'
    sort_order?: 'asc' | 'desc'
  }) => api.get('/admin/invoices/users', { params }),

  // Obter faturas de um usuário específico
  getUserInvoices: (userId: string, params?: {
    page?: number
    per_page?: number
    search?: string
    status?: 'Analisado' | 'Processando' | 'Erro' | 'all'
    date_from?: string
    date_to?: string
    sort_by?: 'created_at' | 'reference_date' | 'total_amount' | 'status'
    sort_order?: 'asc' | 'desc'
  }) => api.get(`/admin/invoices/users/${userId}/invoices`, { params }),

  // Obter detalhes de uma fatura específica (mesmo endpoint do usuário normal)
  getInvoiceDetails: (invoiceId: string) => 
    api.get(`/invoices/${invoiceId}`),

  // Obter transações de uma fatura específica
  getInvoiceTransactions: (invoiceId: string, params?: {
    page?: number
    per_page?: number
    search?: string
    category_filter?: string
    sort_field?: string
    sort_order?: string
  }) => api.get(`/invoices/${invoiceId}/transactions`, { params }),

  // Obter resumo por categoria de uma fatura
  getInvoiceCategorySummary: (invoiceId: string) => 
    api.get(`/invoices/${invoiceId}/category-summary`),

  // Reprocessar uma fatura com erro
  reprocessInvoice: (invoiceId: string) => 
    api.post(`/admin/invoices/${invoiceId}/reprocess`),

  // Atualizar status de uma fatura manualmente
  updateInvoiceStatus: (invoiceId: string, status: 'Analisado' | 'Processando' | 'Erro') =>
    api.patch(`/admin/invoices/${invoiceId}/status`, { status }),

  // Marcar fatura como prioridade para processamento
  prioritizeInvoice: (invoiceId: string, priority: 'low' | 'medium' | 'high') =>
    api.patch(`/admin/invoices/${invoiceId}/priority`, { priority }),

  // Obter estatísticas gerais de faturas
  getInvoicesStats: () => api.get('/admin/invoices/stats'),

  // Obter faturas com problemas/erros
  getProblematicInvoices: (params?: {
    page?: number
    per_page?: number
    error_type?: 'processing_error' | 'validation_error' | 'ai_error' | 'all'
    date_from?: string
    date_to?: string
  }) => api.get('/admin/invoices/problematic', { params }),

  // Exportar dados de faturas (CSV/Excel)
  exportInvoicesData: (params: {
    user_id?: string
    date_from?: string
    date_to?: string
    status?: string
    format: 'csv' | 'excel'
  }) => api.get('/admin/invoices/export', { 
    params,
    responseType: 'blob'
  }),

  // Obter logs de processamento de uma fatura
  getInvoiceProcessingLogs: (invoiceId: string) =>
    api.get(`/admin/invoices/${invoiceId}/logs`),

  // Deletar fatura (apenas admin)
  deleteInvoice: (invoiceId: string) =>
    api.delete(`/admin/invoices/${invoiceId}`),

  // Duplicar processamento (útil para testes)
  duplicateInvoiceProcessing: (invoiceId: string) =>
    api.post(`/admin/invoices/${invoiceId}/duplicate`),

  // Obter relatório detalhado de uma fatura
  getInvoiceReport: (invoiceId: string) =>
    api.get(`/admin/invoices/${invoiceId}/report`),

  // Atualizar dados da fatura manualmente
  updateInvoiceData: (invoiceId: string, data: {
    reference_date?: string
    total_amount?: number
    notes?: string
  }) => api.patch(`/admin/invoices/${invoiceId}`, data),

  // Obter histórico de mudanças de uma fatura
  getInvoiceHistory: (invoiceId: string) =>
    api.get(`/admin/invoices/${invoiceId}/history`),

  // Adicionar comentário administrativo a uma fatura
  addInvoiceComment: (invoiceId: string, comment: string) =>
    api.post(`/admin/invoices/${invoiceId}/comments`, { comment }),

  // Obter comentários de uma fatura
  getInvoiceComments: (invoiceId: string) =>
    api.get(`/admin/invoices/${invoiceId}/comments`),

  // === MÉTODOS PARA GERENCIAR SUGESTÕES ===

  // Obter todas as sugestões de uma fatura
  getInvoiceSuggestions: (invoiceId: string) =>
    api.get(`/admin/invoices/${invoiceId}/suggestions`),

  // Criar nova sugestão para uma fatura
  createSuggestion: (invoiceId: string, suggestionData: {
    type: 'card_recommendation' | 'merchant_recommendation' | 'category_optimization' | 'points_strategy' | 'general_tip'
    title: string
    description: string
    recommendation: string
    impact_description?: string
    potential_points_increase?: string
    priority: 'low' | 'medium' | 'high'
    is_personalized: boolean
    applies_to_future: boolean
  }) => api.post(`/admin/invoices/${invoiceId}/suggestions`, suggestionData),

  // Atualizar uma sugestão existente
  updateSuggestion: (invoiceId: string, suggestionId: string, suggestionData: any) =>
    api.put(`/admin/invoices/${invoiceId}/suggestions/${suggestionId}`, suggestionData),

  // Deletar uma sugestão
  deleteSuggestion: (invoiceId: string, suggestionId: string) =>
    api.delete(`/admin/invoices/${invoiceId}/suggestions/${suggestionId}`),

  // Atualizar status de uma sugestão (ativar/arquivar)
  updateSuggestionStatus: (invoiceId: string, suggestionId: string, status: 'active' | 'archived') =>
    api.patch(`/admin/invoices/${invoiceId}/suggestions/${suggestionId}/status`, { status }),

  // Obter detalhes de uma sugestão específica
  getSuggestionDetails: (invoiceId: string, suggestionId: string) =>
    api.get(`/admin/invoices/${invoiceId}/suggestions/${suggestionId}`),

  // Duplicar sugestão para outras faturas
  duplicateSuggestion: (invoiceId: string, suggestionId: string, targetInvoiceIds: string[]) =>
    api.post(`/admin/invoices/${invoiceId}/suggestions/${suggestionId}/duplicate`, { 
      target_invoice_ids: targetInvoiceIds 
    }),

  // Obter estatísticas de sugestões
  getSuggestionsStats: () =>
    api.get('/admin/suggestions/stats'),

  // Obter sugestões mais utilizadas/efetivas
  getTopSuggestions: (params?: {
    type?: string
    period?: '30d' | '90d' | '1y'
    limit?: number
  }) => api.get('/admin/suggestions/top', { params }),
}