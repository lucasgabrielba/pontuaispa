import { Invoice } from "./finance";
import { Point } from "./rewards";

export interface Card {
  id: string;
  user_id?: string;
  name: string;
  bank: string;
  last_digits: string;
  conversion_rate: number;
  annual_fee: number | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  rewardPrograms?: RewardProgram[];
  invoices?: Invoice[];
}

export interface RewardProgram {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  website?: string | null;
  logo_path?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  pivot?: {
    conversion_rate: number;
    is_primary: boolean;
    terms?: string | null;
  };
  cards?: Card[];
  points?: Point[];
}

export interface RecommendedCard {
  id: string;
  name: string;
  bank: string;
  description: string;
  benefits: string;
  reward_programName: string;
  potential_increase: number;
}