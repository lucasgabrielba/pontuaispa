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

  // Obter detalhes de uma fatura específica
  getInvoiceDetails: (invoiceId: string) => 
    api.get(`/admin/invoices/${invoiceId}`),

  // Obter transações de uma fatura específica
  getInvoiceTransactions: (invoiceId: string, params?: {
    page?: number
    per_page?: number
    search?: string
    category_filter?: string
    sort_field?: string
    sort_order?: string
  }) => api.get(`/admin/invoices/${invoiceId}/transactions`, { params }),

  // Obter resumo por categoria de uma fatura
  getInvoiceCategorySummary: (invoiceId: string) => 
    api.get(`/admin/invoices/${invoiceId}/category-summary`),

  // Reprocessar uma fatura com erro
  reprocessInvoice: (invoiceId: string) => 
    api.post(`/admin/invoices/${invoiceId}/reprocess`),

  // Atualizar status de uma fatura manualmente
  updateInvoiceStatus: (invoiceId: string, status: 'Analisado' | 'Processando' | 'Erro') =>
    api.patch(`/admin/invoices/${invoiceId}/status`, { status }),

  // Obter estatísticas gerais de faturas
  getInvoicesStats: () => api.get('/admin/invoices/stats'),

  // Deletar fatura (apenas admin)
  deleteInvoice: (invoiceId: string) =>
    api.delete(`/admin/invoices/${invoiceId}`),

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
}