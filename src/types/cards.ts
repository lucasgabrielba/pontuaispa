export interface Card {
  id: string; // ULID
  name: string;
  bank: string;
  lastDigits: string;
  rewardProgramId: string;
  rewardProgramName: string;
  conversionRate: number;
  annualFee: number | null;
  isActive: boolean;
}

export interface RewardProgram {
  id: string; // ULID
  name: string;
  description?: string;
}

export interface RecommendedCard {
  id: string; // ULID
  name: string;
  bank: string;
  description: string;
  benefits: string;
  rewardProgramName: string;
  potentialIncrease: number;
}