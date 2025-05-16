import { PointsProgram, CategoryPoints } from './rewards';

export interface DashboardData {
  stats: DashboardStats;
  transactions: DashboardTransaction[];
  pointsPrograms: PointsProgram[];
  pointsByCategory: CategoryPoints[];
  monthlySpent: MonthlySpent[];
  recommendations: Recommendation[];
}

export interface DashboardStats {
  totalSpent: number;
  pointsEarned: number;
  potentialPoints: number;
  activeCards: number;
  spentGrowth: number;
}

export interface DashboardTransaction {
  id: string;
  merchant: string;
  category?: string;
  amount: string;
  points: number;
  is_recommended?: boolean;
  merchantLogo?: string;
}

export interface MonthlySpent {
  name: string;
  total: number;
}

export interface Recommendation {
  id: number | string;
  title: string;
  description: string;
  type: "merchant" | "card";
  recommendation: string;
  potentialGain: number;
}

export interface TransactionHistoryData {
  id: number;
  date: string;
  description: string;
  program: string;
  card: string;
  points: number;
  amount: number;
}