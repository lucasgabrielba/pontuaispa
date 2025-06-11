import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin-service'

export const useAdminDashboard = () => {
  // Estatísticas gerais do sistema
  const stats = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const response = await adminService.getStats()
        return response.data
      } catch (error) {
        console.error('Erro ao obter estatísticas administrativas:', error)
        // Dados mock para desenvolvimento
        return {
          totalUsers: 1247,
          newUsersThisMonth: 89,
          pendingInvoices: 23,
          processedInvoices: 456,
          recommendationsGenerated: 1892,
          recommendationsGrowth: 15,
          conversionRate: 12.5,
          avgInvoicesPerUser: 3.2,
          avgProcessingTime: 4.5,
          activeUsers: 892,
          aiSuccessRate: 94.2,
          invoiceProcessingChart: [
            { name: "01/01", processed: 45, pending: 12 },
            { name: "02/01", processed: 52, pending: 8 },
            { name: "03/01", processed: 48, pending: 15 },
            { name: "04/01", processed: 61, pending: 6 },
            { name: "05/01", processed: 55, pending: 11 },
            { name: "06/01", processed: 67, pending: 9 },
            { name: "07/01", processed: 59, pending: 13 }
          ]
        }
      }
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 10000 // 10 segundos
  })

  // Lista de usuários
  const users = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      try {
        const response = await adminService.getUsers()
        return response.data
      } catch (error) {
        console.error('Erro ao obter usuários:', error)
        // Dados mock para desenvolvimento
        return [
          {
            id: '1',
            name: 'Ana Silva',
            email: 'ana.silva@email.com',
            status: 'Ativo' as const,
            invoicesCount: 15,
            lastLogin: '2024-01-10T10:30:00Z',
            createdAt: '2023-12-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Carlos Santos',
            email: 'carlos.santos@email.com',
            status: 'Ativo' as const,
            invoicesCount: 8,
            lastLogin: '2024-01-09T15:45:00Z',
            createdAt: '2023-11-15T00:00:00Z'
          },
          {
            id: '3',
            name: 'Maria Oliveira',
            email: 'maria.oliveira@email.com',
            status: 'Inativo' as const,
            invoicesCount: 3,
            lastLogin: '2023-12-20T08:20:00Z',
            createdAt: '2023-10-30T00:00:00Z'
          },
          {
            id: '4',
            name: 'João Pereira',
            email: 'joao.pereira@email.com',
            status: 'Ativo' as const,
            invoicesCount: 22,
            lastLogin: '2024-01-10T09:15:00Z',
            createdAt: '2023-09-15T00:00:00Z'
          },
          {
            id: '5',
            name: 'Fernanda Costa',
            email: 'fernanda.costa@email.com',
            status: 'Ativo' as const,
            invoicesCount: 12,
            lastLogin: '2024-01-10T14:22:00Z',
            createdAt: '2023-11-28T00:00:00Z'
          }
        ]
      }
    },
    staleTime: 60000 // 1 minuto
  })

  // Faturas pendentes
  const pendingInvoices = useQuery({
    queryKey: ['admin-pending-invoices'],
    queryFn: async () => {
      try {
        const response = await adminService.getPendingInvoices()
        return response.data
      } catch (error) {
        console.error('Erro ao obter faturas pendentes:', error)
        // Dados mock para desenvolvimento
        return [
          {
            id: '1',
            userName: 'Ana Silva',
            userEmail: 'ana.silva@email.com',
            cardName: 'Nubank Gold',
            amount: 1250.30,
            uploadDate: '2024-01-10T08:30:00Z',
            priority: 'high' as const,
            status: 'pending' as const,
            waitTime: '2h 30m'
          },
          {
            id: '2',
            userName: 'Carlos Santos',
            userEmail: 'carlos.santos@email.com',
            cardName: 'Itaú Personnalité',
            amount: 850.75,
            uploadDate: '2024-01-10T10:15:00Z',
            priority: 'medium' as const,
            status: 'processing' as const,
            waitTime: '45m'
          },
          {
            id: '3',
            userName: 'Maria Oliveira',
            userEmail: 'maria.oliveira@email.com',
            cardName: 'Bradesco Prime',
            amount: 2100.45,
            uploadDate: '2024-01-09T16:45:00Z',
            priority: 'high' as const,
            status: 'error' as const,
            waitTime: '18h'
          },
          {
            id: '4',
            userName: 'João Pereira',
            userEmail: 'joao.pereira@email.com',
            cardName: 'Santander Select',
            amount: 750.20,
            uploadDate: '2024-01-10T11:20:00Z',
            priority: 'low' as const,
            status: 'pending' as const,
            waitTime: '1h 15m'
          },
          {
            id: '5',
            userName: 'Fernanda Costa',
            userEmail: 'fernanda.costa@email.com',
            cardName: 'Banco do Brasil Ourocard',
            amount: 1890.60,
            uploadDate: '2024-01-10T07:45:00Z',
            priority: 'high' as const,
            status: 'pending' as const,
            waitTime: '3h 45m'
          }
        ]
      }
    },
    refetchInterval: 15000, // Atualizar a cada 15 segundos
    staleTime: 5000 // 5 segundos
  })

  // Saúde do sistema
  const systemHealth = useQuery({
    queryKey: ['admin-system-health'],
    queryFn: async () => {
      try {
        const response = await adminService.getSystemHealth()
        return response.data
      } catch (error) {
        console.error('Erro ao obter saúde do sistema:', error)
        // Dados mock para desenvolvimento
        return {
          services: [
            { name: 'API Principal', status: 'online' as const, uptime: 99.9, responseTime: 120 },
            { name: 'Processamento IA', status: 'online' as const, uptime: 98.5, responseTime: 250 },
            { name: 'Base de Dados', status: 'warning' as const, uptime: 97.2, responseTime: 180 },
            { name: 'Sistema de Arquivos', status: 'online' as const, uptime: 99.7, responseTime: 80 }
          ],
          overallHealth: 98.8,
          lastUpdate: new Date().toISOString()
        }
      }
    },
    refetchInterval: 10000, // Atualizar a cada 10 segundos
    staleTime: 5000 // 5 segundos
  })

  // Atividades recentes do sistema
  const recentActivities = useQuery({
    queryKey: ['admin-recent-activities'],
    queryFn: async () => {
      try {
        const response = await adminService.getRecentActivities()
        return response.data
      } catch (error) {
        console.error('Erro ao obter atividades recentes:', error)
        // Dados mock para desenvolvimento
        return [
          {
            id: '1',
            type: 'user_created',
            description: 'Novo usuário registrado: ana.silva@email.com',
            user: { name: 'Ana Silva' },
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            severity: 'success'
          },
          {
            id: '2',
            type: 'invoice_processed',
            description: 'Fatura processada com sucesso - R$ 1.250,30',
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            severity: 'info'
          },
          {
            id: '3',
            type: 'system_alert',
            description: 'Base de dados com alta latência (180ms)',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            severity: 'warning'
          },
          {
            id: '4',
            type: 'settings_changed',
            description: 'Configurações de timeout atualizadas',
            user: { name: 'Admin' },
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            severity: 'info'
          },
          {
            id: '5',
            type: 'user_suspended',
            description: 'Usuário suspenso: carlos.santos@email.com',
            user: { name: 'Admin' },
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            severity: 'error'
          }
        ]
      }
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