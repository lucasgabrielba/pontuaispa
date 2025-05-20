
import { Card } from './cards';
import { Point } from './rewards';
import { User } from './users';

export interface Category {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  transactions?: Transaction[];
}

export interface Invoice {
  id: string;
  user_id: string;
  card_id: string;
  reference_date: string;
  total_amount: number;
  status: string;
  file_path?: string | null;
  due_date?: string | null;
  closing_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user?: User;
  card?: Card;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  invoice_id: string;
  category_id?: string | null;
  merchant_name: string;
  transaction_date: string;
  amount: number;
  points_earned: number;
  is_recommended?: boolean;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  invoice?: Invoice;
  category?: Category;
  points?: Point[];
  category_icon?: string;
  category_color?: string;
  category_name?: string;
}

export interface InvoiceUploadRequest {
  invoice_file: File;
  card_id: string;
  reference_date?: string;
}

export interface InvoiceProcessorResult {
  transactions: Transaction[];
  total_amount: number;
  due_date?: string;
  closing_date?: string;
}

export interface Bank {
  id: string;
  code: string;
  created_at: string;
  description: string;
  is_active: string;
  logo_url: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  updated_at: string;
}