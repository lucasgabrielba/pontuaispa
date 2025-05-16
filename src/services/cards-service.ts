import api from '@/lib/api'
import type { Card } from '@/types/cards'

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

export const cardsService = {
  // Obter todos os cartões
  getCards: () => api.get('/cards'),

  // Obter cartões recomendados
  getRecommendedCards: () => api.get('/cards/recommended'),

  getRewardPrograms: () => api.get('/reward-programs'),

  // Adicionar cartão
  addCard: (data: Omit<Card, 'id' | 'rewardProgramName'>) => api.post('/cards', data),

  // Atualizar cartão
  updateCard: (data: Card) => api.put(`/cards/${data.id}`, data),

  // Atualizar status do cartão
  updateCardStatus: (id: string, isActive: boolean) =>
    api.patch(`/cards/${id}/status`, { isActive }),

  // Métodos para desenvolvimento/mock
  getBanks: () => {
    return Promise.resolve({ data: mockBanks })
  },

}