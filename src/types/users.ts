import { Card } from './cards';
import { Invoice } from './finance';
import { Point } from './rewards';

export type UserStatus = 'Ativo' | 'Inativo';

export interface UserRole {
  id: number;
  name: 'super_admin' | 'admin' | 'client';
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_type: string;
    model_id: string;
    role_id: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  roles: UserRole[];
  preferences?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  cards?: Card[];
  invoices?: Invoice[];
  points?: Point[];
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  user: User;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}