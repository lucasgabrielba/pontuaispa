// src/hooks/use-admin-invoices.ts
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

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
      const params = {
        page: userPage,
        per_page: perPage,
        search: userSearchQuery || undefined
      }
      const response = await api.get('/admin/invoices/users', { params })
      return response.data
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

      const params = {
        page: invoicePage,
        per_page: perPage,
        search: invoiceSearchQuery || undefined
      }
      const response = await api.get(`/admin/invoices/users/${selectedUserId}/invoices`, { params })
      return response.data
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