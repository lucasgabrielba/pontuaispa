// src/hooks/use-analysis.ts
import { useQuery } from '@tanstack/react-query'
import { 
  analysisService, 
  CardRecommendationsResponse,
  TransactionOptimizationsResponse,
  SpendingPattern,
  PointsSummary
} from '@/services/analysis-service'

export const useAnalysis = (hasData: boolean = true) => {
  // Recomendações de cartões
  const cardsRecommendation = useQuery<CardRecommendationsResponse>({
    queryKey: ['cards-recommendation', hasData],
    queryFn: async () => {
      if (!hasData) {
        return {
          recommendations: [],
          summary: '',
          action_items: []
        }
      }
      
      try {
        const response = await analysisService.getCardsRecommendation()
        return response.data
      } catch (error) {
        console.error('Erro ao obter recomendações de cartões:', error)
        return {
          recommendations: [],
          error: 'Não foi possível obter recomendações de cartões.'
        }
      }
    },
    enabled: hasData,
    staleTime: 15 * 60 * 1000 // 15 minutos
  })
  
  // Otimizações de transações
  const transactionOptimizations = useQuery<TransactionOptimizationsResponse>({
    queryKey: ['transaction-optimizations', hasData],
    queryFn: async () => {
      if (!hasData) {
        return {
          optimizations: [],
          summary: ''
        }
      }
      
      try {
        const response = await analysisService.getTransactionOptimizations()
        return response.data
      } catch (error) {
        console.error('Erro ao obter otimizações de transações:', error)
        return {
          optimizations: [],
          error: 'Não foi possível obter otimizações de transações.'
        }
      }
    },
    enabled: hasData,
    staleTime: 15 * 60 * 1000 // 15 minutos
  })
  
  // Padrões de gasto
  const useSpendingPatterns = (startDate?: string, endDate?: string) => 
    useQuery<SpendingPattern>({
      queryKey: ['spending-patterns', startDate, endDate, hasData],
      queryFn: async () => {
        if (!hasData) {
          return {
            category_spending: [],
            monthly_spending: [],
            merchant_average: [],
            optimization_opportunities: []
          }
        }
        
        try {
          const response = await analysisService.getSpendingPatterns(startDate, endDate)
          return response.data
        } catch (error) {
          console.error('Erro ao obter padrões de gasto:', error)
          return {
            category_spending: [],
            monthly_spending: [],
            merchant_average: [],
            error: 'Não foi possível obter padrões de gasto.'
          }
        }
      },
      enabled: hasData,
      staleTime: 15 * 60 * 1000 // 15 minutos
    })
  
  // Resumo de pontos
  const pointsSummary = useQuery<PointsSummary>({
    queryKey: ['points-summary', hasData],
    queryFn: async () => {
      if (!hasData) {
        return {
          points_by_program: [],
          expiring_points: [],
          monthly_accumulation: [],
          recommendations: {
            message: '',
            suggested_actions: []
          }
        }
      }
      
      try {
        const response = await analysisService.getPointsSummary()
        return response.data
      } catch (error) {
        console.error('Erro ao obter resumo de pontos:', error)
        return {
          points_by_program: [],
          expiring_points: [],
          monthly_accumulation: [],
          recommendations: {
            message: 'Não foi possível obter resumo de pontos.',
            suggested_actions: []
          }
        }
      }
    },
    enabled: hasData,
    staleTime: 15 * 60 * 1000 // 15 minutos
  })
  
  return {
    cardsRecommendation,
    transactionOptimizations,
    useSpendingPatterns,
    pointsSummary
  }
}