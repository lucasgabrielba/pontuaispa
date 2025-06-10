import api from '@/lib/api'

export interface CardRecommendation {
  card_name: string;
  description: string;
  annual_fee: number;
  potential_points_increase: string;
  analysis: string;
}

export interface CardRecommendationsResponse {
  recommendations: CardRecommendation[];
  summary?: string;
  action_items?: string[];
  top_categories?: {
    id: string;
    name: string;
    icon: string;
    color: string;
    total: number;
    count: number;
  }[];
  top_merchants?: {
    merchant_name: string;
    total: number;
    frequency: number;
  }[];
}

export interface TransactionOptimization {
  transaction_details: {
    merchant_name: string;
    amount?: number;
    date?: string;
  };
  current_card: string;
  recommended_card: string;
  potential_increase_percentage: string;
  reason?: string;
}

export interface TransactionOptimizationsResponse {
  optimizations: TransactionOptimization[];
  summary?: string;
  estimated_monthly_point_increase?: number;
}

export interface SpendingPattern {
  category_spending: {
    category: string;
    color?: string;
    icon?: string;
    total: number;
    count: number;
  }[];
  monthly_spending: {
    month: string;
    total: number;
  }[];
  merchant_average: {
    merchant_name: string;
    average: number;
    frequency: number;
  }[];
  optimization_opportunities?: {
    category: string;
    spending: number;
    card_name: string;
    potential_increase: string;
    recommendation: string;
  }[];
}

export interface PointsSummary {
  points_by_program: {
    program: string;
    program_id: string;
    total: number;
  }[];
  expiring_points: {
    program: string;
    amount: number;
    expiration_date: string;
  }[];
  monthly_accumulation: {
    month: string;
    total: number;
  }[];
  recommendations: {
    message: string;
    suggested_actions: string[];
  };
}

export const analysisService = {

  getCardsRecommendation: () => 
    api.get('/analysis/cards-recommendation'),
  
  // Obter otimizações de transações específicas
  getTransactionOptimizations: () => 
    api.get('/analysis/transaction-optimizations'),
  
  // Obter padrões de gasto por período
  getSpendingPatterns: (startDate?: string, endDate?: string) => 
    api.get('/analysis/spending-patterns', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    }),
  
  // Obter resumo de pontos e recomendações de uso
  getPointsSummary: () => 
    api.get('/analysis/points-summary')
}