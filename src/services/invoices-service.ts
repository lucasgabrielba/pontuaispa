// src/services/invoices-service.ts
import api from '@/lib/api'

export interface InvoiceFormData {
  invoice_file: File
  card_id: string
  reference_date: string
}

export interface InvoiceDetailsParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_field?: string;
  sort_order?: string;
  category_filter?: string;
}

export const invoicesService = {
  // Upload de fatura
  uploadInvoice: (data: InvoiceFormData) => {
    const formData = new FormData()
    formData.append('invoice_file', data.invoice_file)
    formData.append('card_id', data.card_id)
    formData.append('reference_date', data.reference_date)
    
    return api.post('/invoices/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getInvoiceDetails: (id: string, params: InvoiceDetailsParams = {}) => {
    return api.get(`/invoices/${id}`, { params });
  },

  listInvoices: () => api.get('/invoices'),

  // Obtém as categorias das transações para uso em filtros
  listCategories: () => {
    const categories = [
      { label: 'Supermercado', value: 'supermercado' },
      { label: 'Restaurante', value: 'restaurante' },
      { label: 'Combustível', value: 'combustivel' },
      { label: 'Transporte', value: 'transporte' },
      { label: 'Streaming', value: 'streaming' },
      { label: 'Saúde', value: 'saude' },
      { label: 'Educação', value: 'educacao' },
      { label: 'Lazer', value: 'lazer' }
    ]
    
    return Promise.resolve({ data: { data: categories } })
  }
}