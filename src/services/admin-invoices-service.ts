import api from '@/lib/api'

export interface CreateSuggestionData {
  category_id?: string
  type: 'card_recommendation' | 'merchant_recommendation' | 'category_optimization' | 'points_strategy' | 'general_tip'
  title: string
  description: string
  recommendation: string
  impact_description?: string
  potential_points_increase?: string
  priority: 'low' | 'medium' | 'high'
}

export interface UpdateSuggestionData extends Partial<CreateSuggestionData> {
  is_active?: boolean
}

export interface InvoiceCategory {
  id: string
  name: string
  icon: string
  color: string
  total_amount: number
  total_amount_formatted: string
  transaction_count: number
  total_points: number
}

export const adminInvoicesService = {
  // Buscar sugestões de uma fatura
  getInvoiceSuggestions: (invoiceId: string) => {
    return api.get(`/admin/invoices/${invoiceId}/suggestions`)
  },

  // Criar nova sugestão
  createSuggestion: (invoiceId: string, data: CreateSuggestionData) => {
    return api.post(`/admin/invoices/${invoiceId}/suggestions`, data)
  },

  // Atualizar sugestão
  updateSuggestion: (invoiceId: string, suggestionId: string, data: UpdateSuggestionData) => {
    return api.put(`/admin/invoices/${invoiceId}/suggestions/${suggestionId}`, data)
  },

  // Deletar sugestão
  deleteSuggestion: (invoiceId: string, suggestionId: string) => {
    return api.delete(`/admin/invoices/${invoiceId}/suggestions/${suggestionId}`)
  },

  // Buscar categorias da fatura para sugestões
  getInvoiceCategoriesForSuggestions: (invoiceId: string) => {
    return api.get(`/admin/invoices/${invoiceId}/categories-for-suggestions`)
  },

  // Alternar status da sugestão
  toggleSuggestionStatus: (invoiceId: string, suggestionId: string) => {
    return api.patch(`/admin/invoices/${invoiceId}/suggestions/${suggestionId}/toggle-status`)
  },
}