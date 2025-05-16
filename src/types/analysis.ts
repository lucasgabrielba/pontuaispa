import { RecommendedCard } from './cards';

export interface CardsRecommendation {
  recommendations: RecommendedCard[];
  top_categories: string[];
  top_merchants: string[];
}

export interface SpendingPatterns {
  category_spending: CategorySpending[];
  monthly_spending: MonthlySpending[];
  merchant_average: MerchantAverage[];
}

export interface CategorySpending {
  category: string;
  total: number;
}

export interface MonthlySpending {
  month: string;
  total: number;
}

export interface MerchantAverage {
  merchant_name: string;
  average: number;
  frequency: number;
}

export interface SpendingEfficiency {
  category: string;
  current_points: number;
  potential_points: number;
  efficiency_percentage: number;
  recommended_card?: string;
}

export interface PointsOptimizationResult {
  current_total: number;
  potential_total: number;
  increase_percentage: number;
  recommendations: PointsOptimizationRecommendation[];
}

export interface PointsOptimizationRecommendation {
  category: string;
  current_card: string;
  recommended_card: string;
  potential_increase: number;
}