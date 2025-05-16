import api from '@/lib/api'

export interface InvoiceFormData {
  invoice_file: File
  card_id: string
  reference_date: string
}

export interface InvoiceHistoryItem {
  id: number
  dataEnvio: string
  cartao: string
  mesReferencia: string
  status: string
  valor: string
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

  // Obtém o histórico de faturas
  getInvoicesHistory: () => {
    // Dados mocados para simular a resposta da API
    const mockData = [
      {
        id: 1,
        dataEnvio: '10/05/2023',
        cartao: 'Nubank',
        mesReferencia: 'Abril/2023',
        status: 'Analisado',
        valor: '3.245,78'
      },
      {
        id: 2,
        dataEnvio: '12/04/2023',
        cartao: 'Itaucard Platinum',
        mesReferencia: 'Março/2023',
        status: 'Analisado',
        valor: '2.987,45'
      },
      {
        id: 3,
        dataEnvio: '08/06/2023',
        cartao: 'Nubank',
        mesReferencia: 'Maio/2023',
        status: 'Em análise',
        valor: '3.521,89'
      },
      {
        id: 4,
        dataEnvio: '05/03/2023',
        cartao: 'Itaucard Platinum',
        mesReferencia: 'Fevereiro/2023',
        status: 'Analisado',
        valor: '2.458,32'
      },
      {
        id: 5,
        dataEnvio: '10/07/2023',
        cartao: 'Nubank',
        mesReferencia: 'Junho/2023',
        status: 'Pendente',
        valor: '3.789,45'
      }
    ]
    
    // Simula uma promise que retorna os dados
    return Promise.resolve({ data: { data: mockData } })
  },

  // Detalhes de uma fatura específica
  getInvoiceDetails: (id: number) => {
    // Aqui você pode implementar dados mockados para detalhes da fatura
    return Promise.resolve({
      data: {
        id,
        dataEnvio: '10/05/2023',
        cartao: 'Nubank',
        mesReferencia: 'Abril/2023',
        status: 'Analisado',
        valor: '3.245,78',
        transacoes: [
          {
            id: 1,
            data: '25/04/2023',
            descricao: 'Supermercado Extra',
            valor: 245.67,
            categoria: 'Supermercado'
          },
          {
            id: 2,
            data: '24/04/2023',
            descricao: 'Netflix',
            valor: 39.90,
            categoria: 'Streaming'
          },
          {
            id: 3,
            data: '20/04/2023',
            descricao: 'Posto Ipiranga',
            valor: 200.00,
            categoria: 'Combustível'
          }
        ]
      }
    })
  },
  
  // Obtém as categorias das transações para uso em filtros
  getCategories: () => {
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