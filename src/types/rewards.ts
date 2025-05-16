import { User } from './users';
import { RewardProgram } from './cards';
import { Transaction } from './finance';

export interface Point {
  id: string;
  user_id: string;
  reward_program_id: string;
  transaction_id?: string | null;
  amount: number;
  expiration_date?: string | null;
  status: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user?: User;
  rewardProgram?: RewardProgram;
  transaction?: Transaction;
}

export interface PointsProgram {
  name: string;
  value: number;
  color: string;
}

export interface CategoryPoints {
  nome: string;
  pontosGanhos: number;
  pontosPotenciais: number;
}

export interface PointsSummary {
  points_by_program: PointsByProgram[];
  expiring_points: ExpiringPoint[];
  monthly_accumulation: MonthlyAccumulation[];
  recommendations: PointsRecommendations;
}

export interface PointsByProgram {
  program: string;
  total: number;
}

export interface ExpiringPoint {
  program: string;
  amount: number;
  expiration_date: string;
}

export interface MonthlyAccumulation {
  month: string;
  total: number;
}

export interface PointsRecommendations {
  message: string;
  suggested_actions: string[];
}