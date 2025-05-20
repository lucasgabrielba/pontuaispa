// src/hooks/use-dashboard.ts
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard-service'

export const useDashboard = (hasData: boolean = true) => {
  // Estatísticas gerais
  const stats = useQuery({
    queryKey: ['dashboard-stats', hasData],
    queryFn: async () => {
      if (!hasData) return {
        totalSpent: 0,
        pointsEarned: 0,
        activeCards: 0
      }
      
      try {
        const response = await dashboardService.getStats()
        return response.data
      } catch (error) {
        console.error('Erro ao obter estatísticas:', error)
        return {
          totalSpent: 0,
          pointsEarned: 0,
          activeCards: 0
        }
      }
    },
    enabled: true
  })
  
  // Transações recentes
  const transactions = useQuery({
    queryKey: ['dashboard-transactions', hasData],
    queryFn: async () => {
      if (!hasData) return []
      
      try {
        const response = await dashboardService.getRecentTransactions()
        console.log(response.data);
        return response.data
      } catch (error) {
        console.error('Erro ao obter transações:', error)
        return []
      }
    },
    enabled: hasData
  })
  
  // Gastos mensais
  const monthlySpent = useQuery({
    queryKey: ['dashboard-monthly-spent', hasData],
    queryFn: async () => {
      if (!hasData) return []
      
      try {
        const response = await dashboardService.getMonthlySpent()
        return response.data
      } catch (error) {
        console.error('Erro ao obter gastos mensais:', error)
        return []
      }
    },
    enabled: hasData
  })
  
  // Programas de pontos
  const pointsPrograms = useQuery({
    queryKey: ['dashboard-points-programs', hasData],
    queryFn: async () => {
      if (!hasData) return []
      
      try {
        const response = await dashboardService.getPointsPrograms()
        return response.data
      } catch (error) {
        console.error('Erro ao obter programas de pontos:', error)
        return []
      }
    },
    enabled: hasData
  })
  
  // Recomendações
  const recommendations = useQuery({
    queryKey: ['dashboard-recommendations', hasData],
    queryFn: async () => {
      if (!hasData) return []
      
      try {
        const response = await dashboardService.getRecommendations()
        return response.data
      } catch (error) {
        console.error('Erro ao obter recomendações:', error)
        return []
      }
    },
    enabled: hasData
  })
  
  return {
    stats,
    transactions,
    monthlySpent,
    pointsPrograms,
    recommendations
  }
}