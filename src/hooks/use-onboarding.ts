import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { onboardingService, type CardCreateRequest, type InvoiceUploadRequest } from '@/services/onboarding-service'
import { toast } from '@/hooks/use-toast'

export const useOnboarding = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cardId, setCardId] = useState<string | null>(null)

  // Verificar se o usuário tem cartões
  const userCards = useQuery({
    queryKey: ['user-cards'],
    queryFn: async () => {
      try {
        const response = await onboardingService.checkUserHasCards()
        return response.data
      } catch (error) {
        console.error('Erro ao verificar cartões:', error)
        return { cards: [] }
      }
    }
  })

  // Obter programas de recompensas
  const rewardPrograms = useQuery({
    queryKey: ['reward-programs'],
    queryFn: async () => {
      try {
        const response = await onboardingService.getRewardPrograms()
        return response.data
      } catch (error) {
        console.error('Erro ao obter programas de recompensas:', error)
        return []
      }
    }
  })

  // Mutação para criar cartão
  const createCard = useMutation({
    mutationFn: async (data: CardCreateRequest) => {
      return onboardingService.createCard(data)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['user-cards'] })
      
      // Armazenar o ID do cartão para usar no upload da fatura
      if (response.data && response.data.id) {
        setCardId(response.data.id)
      }
      
      toast({
        title: 'Cartão criado com sucesso',
        description: 'Agora vamos adicionar sua primeira fatura'
      })
    },
    onError: (error: any) => {
      console.error('Erro ao criar cartão:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao criar cartão',
        description: error.response?.data?.message || 'Não foi possível criar o cartão'
      })
    }
  })

  // Mutação para upload de fatura
  const uploadInvoice = useMutation({
    mutationFn: async (data: InvoiceUploadRequest) => {
      return onboardingService.uploadInvoice(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-cards'] })
      toast({
        title: 'Fatura enviada com sucesso',
        description: 'Sua fatura está sendo processada'
      })
      
      // Redirecionar para o dashboard após conclusão
      navigate({ to: '/' })
    },
    onError: (error: any) => {
      console.error('Erro ao enviar fatura:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar fatura',
        description: error.response?.data?.message || 'Não foi possível enviar a fatura'
      })
    }
  })

  // Função para verificar necessidade de onboarding
  const checkNeedsOnboarding = () => {
    if (!userCards.data || !userCards.data.cards || userCards.data.cards.length === 0) {
      navigate({ to: '/onboarding' })
      return true
    }
    return false
  }

  return {
    userCards,
    rewardPrograms,
    createCard,
    uploadInvoice,
    checkNeedsOnboarding,
    cardId
  }
}