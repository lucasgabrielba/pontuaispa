import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin-service'

export const useAdminDashboard = () => {
  // Estatísticas gerais do sistema
  const stats = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await adminService.getStats()
      return response.data
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 10000 // 10 segundos
  })

  // Lista de usuários
  const users = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await adminService.getUsers()
      return response.data
    },
    staleTime: 60000 // 1 minuto
  })

  // Faturas pendentes
  const pendingInvoices = useQuery({
    queryKey: ['admin-pending-invoices'],
    queryFn: async () => {
      const response = await adminService.getPendingInvoices()
      return response.data
    },
    refetchInterval: 15000, // Atualizar a cada 15 segundos
    staleTime: 5000 // 5 segundos
  })

  // Saúde do sistema
  const systemHealth = useQuery({
    queryKey: ['admin-system-health'],
    queryFn: async () => {
      const response = await adminService.getSystemHealth()
      return response.data
    },
    refetchInterval: 10000, // Atualizar a cada 10 segundos
    staleTime: 5000 // 5 segundos
  })

  // Atividades recentes do sistema
  const recentActivities = useQuery({
    queryKey: ['admin-recent-activities'],
    queryFn: async () => {
      const response = await adminService.getRecentActivities()
      return response.data
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 15000 // 15 segundos
  })

  const isLoading = stats.isLoading || users.isLoading || pendingInvoices.isLoading || systemHealth.isLoading || recentActivities.isLoading

  return {
    stats: stats.data,
    users: users.data,
    pendingInvoices: pendingInvoices.data,
    systemHealth: systemHealth.data,
    recentActivities: recentActivities.data,
    isLoading,
    
    // Funções de refetch para atualização manual
    refetchStats: stats.refetch,
    refetchUsers: users.refetch,
    refetchPendingInvoices: pendingInvoices.refetch,
    refetchSystemHealth: systemHealth.refetch,
    refetchRecentActivities: recentActivities.refetch
  }
}

// Tipos auxiliares
export interface AdminStats {
  totalUsers: number
  newUsersThisMonth: number
  pendingInvoices: number
  processedInvoices: number
  recommendationsGenerated: number
  recommendationsGrowth: number
  conversionRate: number
  avgInvoicesPerUser: number
  avgProcessingTime: number
  activeUsers: number
  aiSuccessRate: number
  invoiceProcessingChart: Array<{
    name: string
    processed: number
    pending: number
  }>
}

export interface AdminUser {
  id: string
  name: string
  email: string
  status: 'Ativo' | 'Inativo'
  invoicesCount: number
  lastLogin: string
  createdAt: string
  avatar?: string
}

export interface PendingInvoice {
  id: string
  userName: string
  userEmail: string
  cardName: string
  amount: number
  uploadDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'processing' | 'error'
  waitTime: string
}

export interface SystemHealth {
  services: Array<{
    name: string
    status: 'online' | 'warning' | 'offline'
    uptime: number
    responseTime: number
  }>
  overallHealth: number
  lastUpdate: string
}