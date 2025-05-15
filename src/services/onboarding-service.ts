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

// Simular resposta da API para desenvolvimento
const mockBanks = [
  "Nubank", 
  "Itaú", 
  "Banco do Brasil", 
  "Bradesco", 
  "Santander", 
  "Caixa", 
  "Banco Inter", 
  "C6 Bank"
]

const mockRewardPrograms = [
  { id: "1", name: "Livelo", description: "Programa multi-parceiros", image_url: "" },
  { id: "2", name: "Smiles", description: "Programa de fidelidade da Gol", image_url: "" },
  { id: "3", name: "Esfera", description: "Programa de fidelidade do Santander", image_url: "" },
  { id: "4", name: "TudoAzul", description: "Programa de fidelidade da Azul", image_url: "" },
  { id: "5", name: "Dotz", description: "Programa multi-parceiros", image_url: "" },
]

export const onboardingService = {
  // Verificar se o usuário tem cartões
  checkUserHasCards: () => api.get('/cards'),

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

  // Métodos para desenvolvimento/mock
  getBanks: () => {
    return Promise.resolve({ data: mockBanks })
  },

  getMockRewardPrograms: () => {
    return Promise.resolve({ data: mockRewardPrograms })
  }
}