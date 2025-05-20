import api from '@/lib/api'

export interface Transaction {
  id: string;
  merchant: string;
  merchantLogo?: string;
  category: string;
  amount: string;
  points: number;
  isRecommended: boolean;
  category_color: string;
  category_icon: string;
  category_name: string;
}

export interface DashboardStats {
  totalSpent: number;
  spentGrowth?: number;
  pointsEarned: number;
  potentialPoints?: number;
  activeCards: number;
}

export interface MonthlySpent {
  name: string;
  total: number;
}

export interface PointsProgram {
  name: string;
  value: number;
  color: string;
}

export interface Recommendation {
  id: number | string;
  title: string;
  description: string;
  type: "merchant" | "card";
  recommendation: string;
  potentialGain: number;
}

export const dashboardService = {
  // Obter estatísticas gerais do dashboard
  getStats: () => api.get('/dashboard/stats'),
  
  // Obter transações recentes
  getRecentTransactions: () => api.get('/dashboard/transactions'),
  
  // Obter dados de gastos mensais
  getMonthlySpent: () => api.get('/dashboard/monthly-spent'),
  
  // Obter distribuição de pontos por programa
  getPointsPrograms: () => api.get('/dashboard/points-programs'),
  
  // Obter recomendações personalizadas
  getRecommendations: () => api.get('/dashboard/recommendations'),
}