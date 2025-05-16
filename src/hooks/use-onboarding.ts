import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { onboardingService } from '@/services/onboarding-service'
import { toast } from '@/hooks/use-toast'

interface CardCreateRequest {
  name: string;
  bank: string;
  last_digits: string;
  conversion_rate?: number;
  annual_fee?: number | null;
  active: boolean;
  reward_program_id?: string;
}

interface InvoiceUploadRequest {
  invoice_file: File;
  card_id: string;
  reference_date: string;
}

interface UserCardsResponse {
  data: Array<{
    id: string;
    name: string;
    [key: string]: any;
  }>;
}

interface CardCreateResponse {
  data: {
    id: string;
    [key: string]: any;
  };
}

interface UseOnboardingReturn {
  userHasCards: ReturnType<typeof useQuery<boolean, Error>>;
  userCards: ReturnType<typeof useQuery<UserCardsResponse, Error>>;
  rewardPrograms: ReturnType<typeof useQuery<any[], Error>>;
  createCard: ReturnType<typeof useMutation<CardCreateResponse, Error, CardCreateRequest>>;
  uploadInvoice: ReturnType<typeof useMutation<any, Error, InvoiceUploadRequest>>;
  checkNeedsOnboarding: () => boolean;
  cardId: string | null;
  setCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useOnboarding = (): UseOnboardingReturn => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cardId, setCardId] = useState<string | null>(null)

  const userHasCards = useQuery<boolean, Error>({
    queryKey: ['user-has-cards'],
    queryFn: async () => {
      try {
        const response = await onboardingService.checkUserHasCards()
        return response.data
      } catch (error) {
        console.error('Erro ao verificar cartões:', error)
        return false
      }
    }
  })
  
  // Verificar se o usuário tem cartões
  const userCards = useQuery<UserCardsResponse, Error>({
    queryKey: ['user-cards'],
    queryFn: async () => {
      try {
        const response = await onboardingService.getUserCards()
        return response.data
      } catch (error) {
        console.error('Erro ao verificar cartões:', error)
        return { cards: [] }
      }
    }
  })
  
  // Obter programas de recompensas
  const rewardPrograms = useQuery<any[], Error>({
    queryKey: ['reward-programs'],
    queryFn: async () => {
      try {
        const response = await onboardingService.getRewardPrograms()
        return response.data.data
      } catch (error) {
        console.error('Erro ao obter programas de recompensas:', error)
        return []
      }
    }
  })
  
  // Mutação para criar cartão
  const createCard = useMutation<CardCreateResponse, Error, CardCreateRequest>({
    mutationFn: async (data: CardCreateRequest) => {
      return onboardingService.createCard(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-cards'] })
      
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
  const uploadInvoice = useMutation<any, Error, InvoiceUploadRequest>({
    mutationFn: async (data: InvoiceUploadRequest) => {
      return onboardingService.uploadInvoice(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-cards'] })
      toast({
        title: 'Fatura enviada com sucesso',
        description: 'Sua fatura está sendo processada'
      })
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
  const checkNeedsOnboarding = (): boolean => {
    if (!userCards.data || !userCards.data.data || userCards.data.data.length === 0) {
      navigate({ to: '/onboarding' })
      return true
    }
    return false
  }
  
  return {
    userHasCards,
    userCards,
    rewardPrograms,
    createCard,
    uploadInvoice,
    checkNeedsOnboarding,
    cardId,
    setCardId
  }
}