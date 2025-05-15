// src/hooks/use-dashboard.ts
import { dashboardService } from '@/services/dashboard-service';
import { useQuery } from '@tanstack/react-query'


export function useDashboard(hasData = true) {
  const dashboardData = useQuery({
    queryKey: ['dashboard', hasData],
    queryFn: async () => {
      
      if (!hasData) {
        return dashboardService.getEmptyDashboard().then(res => res.data);
      }
      return dashboardService.getDashboardData().then(res => res.data);
    },
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  const stats = useQuery({
    queryKey: ['dashboard', 'stats', hasData],
    queryFn: async () => {

      if (!hasData) {
        return { 
          totalSpent: 0,
          pointsEarned: 0,
          potentialPoints: 0,
          activeCards: 0,
          spentGrowth: 0
        };
      }

      return dashboardService.getStats().then(res => res.data);
    },
    staleTime: 5 * 60 * 1000
  });

  // Buscar transações recentes
  const transactions = useQuery({
    queryKey: ['dashboard', 'transactions', hasData],
    queryFn: async () => {

      if (!hasData) {
        return [];
      }
      return dashboardService.getTransactions().then(res => res.data);
    },
    staleTime: 5 * 60 * 1000
  });

  // Buscar programas de pontos
  const pointsPrograms = useQuery({
    queryKey: ['dashboard', 'points-programs', hasData],
    queryFn: async () => {

      if (!hasData) {
        return [];
      }
      return dashboardService.getPointsPrograms().then(res => res.data);
    },
    staleTime: 5 * 60 * 1000
  });

  // Buscar pontos por categoria
  const pointsByCategory = useQuery({
    queryKey: ['dashboard', 'points-by-category', hasData],
    queryFn: async () => {

      if (!hasData) {
        return [];
      }
      return dashboardService.getPointsByCategory().then(res => res.data);
    },
    staleTime: 5 * 60 * 1000
  });

  // Buscar gastos mensais
  const monthlySpent = useQuery({
    queryKey: ['dashboard', 'monthly-spent', hasData],
    queryFn: async () => {

      if (!hasData) {
        return [];
      }
      return dashboardService.getMonthlySpent().then(res => res.data);
    },
    staleTime: 5 * 60 * 1000
  });

  // Buscar recomendações
  const recommendations = useQuery({
    queryKey: ['dashboard', 'recommendations', hasData],
    queryFn: async () => {

      if (!hasData) {
        return [];
      }
      return dashboardService.getRecommendations().then(res => res.data);
    },
    staleTime: 5 * 60 * 1000
  });

  return {
    dashboardData,
    stats,
    transactions,
    pointsPrograms,
    pointsByCategory,
    monthlySpent,
    recommendations,
  };
}