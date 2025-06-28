import api from '@/lib/api'

export interface CreateSuggestionData {
  title: string;
  description: string;
  type: 'card_recommendation' | 'merchant_recommendation' | 'category_optimization' | 'points_strategy' | 'general_tip';
  priority?: 'low' | 'medium' | 'high';
  recommendation: string;
  impact_description?: string;
  potential_points_increase?: string;
  is_personalized?: boolean;
  applies_to_future?: boolean;
  additional_data?: Record<string, any>;
}

export interface Suggestion {
  id: string;
  invoice_id: string;
  created_by: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  recommendation: string;
  impact_description?: string;
  potential_points_increase?: string;
  is_personalized: boolean;
  applies_to_future: boolean;
  additional_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by_user?: {
    id: string;
    name: string;
  };
  type_display: string;
  priority_display: string;
}

export interface SuggestionStats {
  total: number;
  by_priority: {
    high: number;
    medium: number;
    low: number;
  };
  personalized: number;
  applies_to_future: number;
  by_type: Record<string, number>;
}

export const suggestionsService = {
  // Listar todas as sugestões com filtros
  list: (params?: {
    invoice_id?: string;
    type?: string;
    priority?: string;
    page?: number;
    per_page?: number;
  }) => {
    return api.get('/suggestions', { params });
  },

  // Obter uma sugestão específica
  get: (suggestionId: string) => {
    return api.get(`/suggestions/${suggestionId}`);
  },

  // Criar uma nova sugestão
  create: (suggestionData: CreateSuggestionData) => {
    return api.post('/suggestions', suggestionData);
  },

  // Atualizar uma sugestão
  update: (suggestionId: string, suggestionData: Partial<CreateSuggestionData>) => {
    return api.put(`/suggestions/${suggestionId}`, suggestionData);
  },

  // Deletar uma sugestão
  delete: (suggestionId: string) => {
    return api.delete(`/suggestions/${suggestionId}`);
  },

  // Métodos específicos para faturas
  invoice: {
    // Listar sugestões de uma fatura
    list: (invoiceId: string) => {
      return api.get(`/invoices/${invoiceId}/suggestions`);
    },

    // Criar sugestão para uma fatura
    create: (invoiceId: string, suggestionData: CreateSuggestionData) => {
      return api.post(`/invoices/${invoiceId}/suggestions`, suggestionData);
    },

    // Obter estatísticas das sugestões de uma fatura
    getStats: (invoiceId: string) => {
      return api.get(`/invoices/${invoiceId}/suggestions/stats`);
    }
  }
};