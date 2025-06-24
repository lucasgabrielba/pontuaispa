// src/hooks/use-admin-invoices.ts
import { useQuery } from '@tanstack/react-query'
import { adminInvoicesService } from '@/services/admin-invoices-service'

interface UseAdminInvoicesParams {
  userPage: number
  invoicePage: number
  userSearchQuery: string
  invoiceSearchQuery: string
  selectedUserId: string | null
  perPage: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  invoices_count: number
  last_invoice_date?: string
  created_at: string
  status: string
}

export interface AdminUsersResponse {
  current_page: number
  data: AdminUser[]
  last_page: number
  per_page: number
  total: number
}

export interface AdminInvoice {
  id: string
  card_name: string
  card_last_digits: string
  reference_date: string
  status: string
  total_amount: number
  created_at: string
  transactions_count?: number
}

export interface AdminInvoicesResponse {
  current_page: number
  data: AdminInvoice[]
  last_page: number
  per_page: number
  total: number
}

export const useAdminInvoices = ({
  userPage,
  invoicePage,
  userSearchQuery,
  invoiceSearchQuery,
  selectedUserId,
  perPage
}: UseAdminInvoicesParams) => {

  // Query para buscar usuários
  const users = useQuery<AdminUsersResponse>({
    queryKey: ['admin-users-invoices', userPage, perPage, userSearchQuery],
    queryFn: async () => {
      try {
        const params = {
          page: userPage,
          per_page: perPage,
          search: userSearchQuery || undefined
        }
        const response = await adminInvoicesService.getUsers(params)
        return response.data
      } catch (error) {
        console.error('Erro ao obter usuários para faturas:', error)
        // Dados mock para desenvolvimento
        return {
          current_page: 1,
          last_page: 3,
          per_page: perPage,
          total: 42,
          data: [
            {
              id: '1',
              name: 'Ana Silva',
              email: 'ana.silva@email.com',
              invoices_count: 15,
              last_invoice_date: '2024-01-10T00:00:00Z',
              created_at: '2023-12-01T00:00:00Z',
              status: 'Ativo'
            },
            {
              id: '2',
              name: 'Carlos Santos',
              email: 'carlos.santos@email.com',
              invoices_count: 8,
              last_invoice_date: '2024-01-08T00:00:00Z',
              created_at: '2023-11-15T00:00:00Z',
              status: 'Ativo'
            },
            {
              id: '3',
              name: 'Maria Oliveira',
              email: 'maria.oliveira@email.com',
              invoices_count: 3,
              last_invoice_date: '2023-12-20T00:00:00Z',
              created_at: '2023-10-30T00:00:00Z',
              status: 'Inativo'
            },
            {
              id: '4',
              name: 'João Pereira',
              email: 'joao.pereira@email.com',
              invoices_count: 22,
              last_invoice_date: '2024-01-09T00:00:00Z',
              created_at: '2023-09-15T00:00:00Z',
              status: 'Ativo'
            },
            {
              id: '5',
              name: 'Fernanda Costa',
              email: 'fernanda.costa@email.com',
              invoices_count: 12,
              last_invoice_date: '2024-01-05T00:00:00Z',
              created_at: '2023-11-28T00:00:00Z',
              status: 'Ativo'
            },
            {
              id: '6',
              name: 'Roberto Lima',
              email: 'roberto.lima@email.com',
              invoices_count: 0,
              created_at: '2024-01-01T00:00:00Z',
              status: 'Ativo'
            },
            {
              id: '7',
              name: 'Patricia Mendes',
              email: 'patricia.mendes@email.com',
              invoices_count: 7,
              last_invoice_date: '2024-01-07T00:00:00Z',
              created_at: '2023-12-10T00:00:00Z',
              status: 'Ativo'
            },
            {
              id: '8',
              name: 'Ricardo Alves',
              email: 'ricardo.alves@email.com',
              invoices_count: 19,
              last_invoice_date: '2024-01-06T00:00:00Z',
              created_at: '2023-08-20T00:00:00Z',
              status: 'Ativo'
            },
            {
              id: '9',
              name: 'Luciana Reis',
              email: 'luciana.reis@email.com',
              invoices_count: 4,
              last_invoice_date: '2023-12-28T00:00:00Z',
              created_at: '2023-11-05T00:00:00Z',
              status: 'Ativo'
            },
            {
              id: '10',
              name: 'Eduardo Ferreira',
              email: 'eduardo.ferreira@email.com',
              invoices_count: 11,
              last_invoice_date: '2024-01-04T00:00:00Z',
              created_at: '2023-10-15T00:00:00Z',
              status: 'Ativo'
            }
          ]
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  // Query para buscar faturas do usuário selecionado
  const userInvoices = useQuery<AdminInvoicesResponse>({
    queryKey: ['admin-user-invoices', selectedUserId, invoicePage, perPage, invoiceSearchQuery],
    queryFn: async () => {
      if (!selectedUserId) {
        return {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
          data: []
        }
      }

      try {
        const params = {
          page: invoicePage,
          per_page: perPage,
          search: invoiceSearchQuery || undefined
        }
        const response = await adminInvoicesService.getUserInvoices(selectedUserId, params)
        return response.data
      } catch (error) {
        console.error('Erro ao obter faturas do usuário:', error)
        // Dados mock para desenvolvimento
        const mockInvoices = [
          {
            id: '1',
            card_name: 'Nubank Gold',
            card_last_digits: '1234',
            reference_date: '2024-01-01T00:00:00Z',
            status: 'Analisado',
            total_amount: 125030, // em centavos
            created_at: '2024-01-05T00:00:00Z',
            transactions_count: 15
          },
          {
            id: '2',
            card_name: 'Itaú Personnalité',
            card_last_digits: '5678',
            reference_date: '2023-12-01T00:00:00Z',
            status: 'Analisado',
            total_amount: 87545,
            created_at: '2023-12-08T00:00:00Z',
            transactions_count: 22
          },
          {
            id: '3',
            card_name: 'Bradesco Prime',
            card_last_digits: '9012',
            reference_date: '2023-11-01T00:00:00Z',
            status: 'Processando',
            total_amount: 210045,
            created_at: '2023-11-10T00:00:00Z',
            transactions_count: 8
          },
          {
            id: '4',
            card_name: 'Santander Select',
            card_last_digits: '3456',
            reference_date: '2023-10-01T00:00:00Z',
            status: 'Erro',
            total_amount: 75020,
            created_at: '2023-10-15T00:00:00Z',
            transactions_count: 0
          },
          {
            id: '5',
            card_name: 'Banco do Brasil Ourocard',
            card_last_digits: '7890',
            reference_date: '2023-09-01T00:00:00Z',
            status: 'Analisado',
            total_amount: 189060,
            created_at: '2023-09-12T00:00:00Z',
            transactions_count: 18
          }
        ]

        return {
          current_page: 1,
          last_page: 2,
          per_page: perPage,
          total: mockInvoices.length,
          data: mockInvoices
        }
      }
    },
    enabled: !!selectedUserId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  const isLoadingUsers = users.isLoading
  const isLoadingInvoices = userInvoices.isLoading

  return {
    users: users.data,
    userInvoices: userInvoices.data,
    isLoadingUsers,
    isLoadingInvoices,
    refetchUsers: users.refetch,
    refetchUserInvoices: userInvoices.refetch
  }
}