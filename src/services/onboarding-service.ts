// src/services/onboarding-service.ts
import api from '@/lib/api'

export interface CardRewardProgram {
  reward_program_id: string
  conversion_rate?: number
  is_primary?: boolean
  terms?: string
}

export interface CardCreateRequest {
  name: string
  bank: string
  last_digits: string
  conversion_rate?: number
  annual_fee?: number | null
  active?: boolean 
  reward_programs?: CardRewardProgram[]
}

export interface InvoiceUploadRequest {
  invoice_file: File
  card_id: string
  reference_date?: string
}

export const onboardingService = {
  // Verificar se o usuário tem cartões
  checkUserHasCards: () => api.get('/cards/has-cards'),
 
  // Verificar se o usuário tem cartões
  getUserCards: () => api.get('/cards'),

  // Criar novo cartão
  createCard: (data: CardCreateRequest) => api.post('/cards', data),

  // Obter programas de recompensas disponíveis
  getRewardPrograms: () => api.get('/reward-programs'),

  // Upload de fatura
  uploadInvoice: (data: InvoiceUploadRequest) => {
    const formData = new FormData()
    formData.append('invoice_file', data.invoice_file)
    formData.append('card_id', data.card_id)
    
    if (data.reference_date) {
      formData.append('reference_date', data.reference_date)
    }
    
    return api.post('/invoices/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getBanks: () => api.get('/banks')
}