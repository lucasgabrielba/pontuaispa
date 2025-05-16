import api from '@/lib/api'
import type { Card } from '@/types/cards'

export const cardsService = {
  // Obter todos os cartões
  getCards: () => api.get('/cards'),

  // Obter cartões recomendados
  getRecommendedCards: () => api.get('/cards/recommended'),

  getRewardPrograms: () => api.get('/reward-programs'),

  // Adicionar cartão
  addCard: (data: Omit<Card, 'id' | 'reward_program_name'>) => api.post('/cards', data),

  // Atualizar cartão
  updateCard: (data: Card) => api.put(`/cards/${data.id}`, data),

  // Atualizar status do cartão
  updateCardStatus: (id: string, isActive: boolean) =>
    api.put(`/cards/${id}/status`, { isActive }),

  // Deletar cartão
  deleteCard: (id: string) => api.delete(`/cards/${id}`),

  // listar bancos disponíveis
  getBanks: () => api.get('/banks'),

}