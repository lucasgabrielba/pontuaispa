export interface Card {
  id: string; // ULID
  name: string;
  bank: string;
  last_digits: string;
  reward_program_id: string;
  reward_program_name: string;
  conversion_rate: number;
  annual_fee: number | null;
  is_active: boolean;
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
  reward_programName: string;
  potential_increase: number;
}