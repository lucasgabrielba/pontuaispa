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

// Dados de exemplo para desenvolvimento
const mockDashboardData: DashboardData = {
  stats: {
    totalSpent: 3521.89,
    pointsEarned: 1258,
    potentialPoints: 2431,
    activeCards: 2,
    spentGrowth: 12.5
  },
  transactions: [
    {
      id: '1',
      merchant: 'Supermercado Extra',
      merchantLogo: '/placeholder.svg',
      category: 'Alimentação',
      amount: 'R$ 243,56',
      points: 97,
      isRecommended: true
    },
    {
      id: '2',
      merchant: 'Netflix',
      merchantLogo: '/placeholder.svg',
      category: 'Streaming',
      amount: 'R$ 55,90',
      points: 28,
      isRecommended: false
    },
    {
      id: '3',
      merchant: 'Posto Shell',
      merchantLogo: '/placeholder.svg',
      category: 'Combustível',
      amount: 'R$ 210,45',
      points: 110,
      isRecommended: true
    },
    {
      id: '4',
      merchant: 'Restaurante Outback',
      merchantLogo: '/placeholder.svg',
      category: 'Restaurantes',
      amount: 'R$ 180,76',
      points: 90,
      isRecommended: false
    },
    {
      id: '5',
      merchant: 'Amazon',
      merchantLogo: '/placeholder.svg',
      category: 'Compras Online',
      amount: 'R$ 143,20',
      points: 72,
      isRecommended: true
    },
  ],
  pointsPrograms: [
    { name: 'Livelo', value: 1567, color: '#ff6b6b' },
    { name: 'Smiles', value: 853, color: '#feca57' },
    { name: 'Esfera', value: 435, color: '#48dbfb' },
    { name: 'Outros', value: 214, color: '#1dd1a1' },
  ],
  pointsByCategory: [
    {
      nome: 'Supermercados',
      pontosGanhos: 580,
      pontosPotenciais: 1450,
    },
    {
      nome: 'Restaurantes',
      pontosGanhos: 320,
      pontosPotenciais: 480,
    },
    {
      nome: 'Combustível',
      pontosGanhos: 210,
      pontosPotenciais: 700,
    },
    {
      nome: 'Streaming',
      pontosGanhos: 90,
      pontosPotenciais: 120,
    },
  ],
  monthlySpent: [
    {
      name: 'Jan',
      total: 1890,
    },
    {
      name: 'Fev',
      total: 2350,
    },
    {
      name: 'Mar',
      total: 3100,
    },
    {
      name: 'Abr',
      total: 2700,
    },
    {
      name: 'Mai',
      total: 3250,
    },
    {
      name: 'Jun',
      total: 3521,
    },
  ],
  recommendations: [
    {
      id: 1,
      title: "Supermercado - Mude de estabelecimento",
      description: "Você gastou R$ 1.235,00 em supermercados este mês. Recomendamos trocar de estabelecimento para maximizar pontos.",
      type: "merchant", 
      recommendation: "Carrefour oferece 4x mais pontos com seu cartão atual",
      potentialGain: 200,
    },
    {
      id: 2,
      title: "Postos de combustível - Use outro cartão",
      description: "Seus gastos em postos são significativos (R$ 420,00/mês). Um cartão específico seria melhor.",
      type: "card",
      recommendation: "Cartão Shell Box Itaucard Platinum",
      potentialGain: 120,
    },
    {
      id: 3,
      title: "Restaurantes - Concentre seus gastos",
      description: "Você frequenta restaurantes diversificados. Concentre gastos em estabelecimentos parceiros.",
      type: "merchant",
      recommendation: "Rede Outback (5x mais pontos às terças-feiras)",
      potentialGain: 85,
    },
    {
      id: 4,
      title: "Streaming - Agrupe serviços",
      description: "Você paga por vários serviços de streaming separadamente. Agrupe para maximizar pontos.",
      type: "merchant",
      recommendation: "Plano combo na Amazon Prime",
      potentialGain: 45,
    },
  ]
};

export const dashboardService = {
  // Quando tivermos uma API real, estas funções usarão api.get() em vez de retornar mocks
  getDashboardData: () => {
    return Promise.resolve({ data: mockDashboardData });
  },
  
  getStats: () => {
    return Promise.resolve({ data: mockDashboardData.stats });
  },
  
  getTransactions: () => {
    return Promise.resolve({ data: mockDashboardData.transactions });
  },
  
  getPointsPrograms: () => {
    return Promise.resolve({ data: mockDashboardData.pointsPrograms });
  },
  
  getPointsByCategory: () => {
    return Promise.resolve({ data: mockDashboardData.pointsByCategory });
  },
  
  getMonthlySpent: () => {
    return Promise.resolve({ data: mockDashboardData.monthlySpent });
  },
  
  getRecommendations: () => {
    return Promise.resolve({ data: mockDashboardData.recommendations });
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