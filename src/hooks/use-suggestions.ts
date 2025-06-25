import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { suggestionsService, CreateSuggestionData, Suggestion, SuggestionStats } from '@/services/suggestions-service'

interface UseSuggestionsParams {
  invoiceId?: string;
  enabled?: boolean;
}

export const useSuggestions = ({ invoiceId, enabled = true }: UseSuggestionsParams = {}) => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)

  // Query para listar sugestões de uma fatura
  const {
    data: suggestions,
    isLoading: isLoadingSuggestions,
    error: suggestionsError,
    refetch: refetchSuggestions
  } = useQuery<Suggestion[]>({
    queryKey: ['invoice-suggestions', invoiceId],
    queryFn: () => suggestionsService.invoice.list(invoiceId!).then(res => res.data),
    enabled: enabled && !!invoiceId,
  })

  // Query para estatísticas das sugestões
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery<SuggestionStats>({
    queryKey: ['invoice-suggestions-stats', invoiceId],
    queryFn: () => suggestionsService.invoice.getStats(invoiceId!).then(res => res.data),
    enabled: enabled && !!invoiceId,
  })

  // Mutation para criar sugestão
  const createSuggestionMutation = useMutation({
    mutationFn: (data: CreateSuggestionData) => {
      if (!invoiceId) throw new Error('Invoice ID is required')
      return suggestionsService.invoice.create(invoiceId, data)
    },
    onSuccess: () => {
      // Invalidar e refetch as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['invoice-suggestions', invoiceId] })
      queryClient.invalidateQueries({ queryKey: ['invoice-suggestions-stats', invoiceId] })
      setIsCreating(false)
    },
    onError: (error) => {
      console.error('Erro ao criar sugestão:', error)
      setIsCreating(false)
    }
  })

  // Mutation para deletar sugestão
  const deleteSuggestionMutation = useMutation({
    mutationFn: (suggestionId: string) => suggestionsService.delete(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-suggestions', invoiceId] })
      queryClient.invalidateQueries({ queryKey: ['invoice-suggestions-stats', invoiceId] })
    },
    onError: (error) => {
      console.error('Erro ao deletar sugestão:', error)
    }
  })

  // Mutation para atualizar sugestão
  const updateSuggestionMutation = useMutation({
    mutationFn: ({ suggestionId, data }: { suggestionId: string, data: Partial<CreateSuggestionData> }) => 
      suggestionsService.update(suggestionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-suggestions', invoiceId] })
      queryClient.invalidateQueries({ queryKey: ['invoice-suggestions-stats', invoiceId] })
    },
    onError: (error) => {
      console.error('Erro ao atualizar sugestão:', error)
    }
  })

  const createSuggestion = async (data: CreateSuggestionData) => {
    setIsCreating(true)
    try {
      await createSuggestionMutation.mutateAsync(data)
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const deleteSuggestion = async (suggestionId: string) => {
    try {
      await deleteSuggestionMutation.mutateAsync(suggestionId)
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const updateSuggestion = async (suggestionId: string, data: Partial<CreateSuggestionData>) => {
    try {
      await updateSuggestionMutation.mutateAsync({ suggestionId, data })
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const refetchAll = () => {
    refetchSuggestions()
    refetchStats()
  }

  return {
    // Data
    suggestions: suggestions || [],
    stats,
    
    // Loading states
    isLoading: isLoadingSuggestions || isLoadingStats,
    isLoadingSuggestions,
    isLoadingStats,
    isCreating: isCreating || createSuggestionMutation.isPending,
    isDeleting: deleteSuggestionMutation.isPending,
    isUpdating: updateSuggestionMutation.isPending,
    
    // Error states
    error: suggestionsError || statsError,
    suggestionsError,
    statsError,
    
    // Actions
    createSuggestion,
    deleteSuggestion,
    updateSuggestion,
    refetchAll,
    refetchSuggestions,
    refetchStats,
    
    // Helper computed values
    hasSuggestions: (suggestions?.length || 0) > 0,
    totalSuggestions: suggestions?.length || 0,
    highPrioritySuggestions: suggestions?.filter(s => s.priority === 'high').length || 0,
  }
}