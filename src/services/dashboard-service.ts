import api from '@/lib/api'

export interface DashboardStats {
  totalSpent: number;
  pointsEarned: number;
  potentialPoints: number;
  activeCards: number;
  spentGrowth: number;
}

export interface Transaction {
  id: string;
  merchant: string;
  merchantLogo?: string;
  category: string;
  amount: string;
  points: number;
  isRecommended: boolean;
}

export interface PointsProgram {
  name: string;
  value: number;
  color: string;
}

export interface PointsByCategory {
  nome: string;
  pontosGanhos: number;
  pontosPotenciais: number;
}

export interface MonthlySpent {
  name: string;
  total: number;
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  type: 'merchant' | 'card';
  recommendation: string;
  potentialGain: number;
}

export interface DashboardData {
  stats: DashboardStats;
  transactions: Transaction[];
  pointsPrograms: PointsProgram[];
  pointsByCategory: PointsByCategory[];
  monthlySpent: MonthlySpent[];
  recommendations: Recommendation[];
}

export const dashboardService = {
  getDashboardData: () => {
    return api.get('/dashboard');
  },
  
  getStats: () => {
    return api.get('/dashboard/stats');
  },
  
  getTransactions: () => {
    return api.get('/dashboard/transactions');
  },
  
  getPointsPrograms: () => {
    return api.get('/dashboard/points-programs');
  },
  
  getPointsByCategory: () => {
    return api.get('/dashboard/points-by-category');
  },
  
  getMonthlySpent: () => {
    return api.get('/dashboard/monthly-spent');
  },
  
  getRecommendations: () => {
    return api.get('/dashboard/recommendations');
  },

  // Versão vazia para simular estado sem dados
  getEmptyDashboard: () => {
    return Promise.resolve({ 
      data: {
        stats: {
          totalSpent: 0,
          pointsEarned: 0,
          potentialPoints: 0,
          activeCards: 0,
          spentGrowth: 0
        },
        transactions: [],
        pointsPrograms: [],
        pointsByCategory: [],
        monthlySpent: [],
        recommendations: []
      }
    });
  }
};