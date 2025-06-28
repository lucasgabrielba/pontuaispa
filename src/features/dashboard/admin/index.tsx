import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { 
  Users, 
  FileText, 
} from 'lucide-react'
import { useAdminDashboard } from '@/hooks/use-admin-dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { AdminOverview } from './components/admin-overview'

export default function AdminDashboard() {
  const navigate = useNavigate()
  
  // Hook customizado para dados administrativos
  const { 
    stats, 
    pendingInvoices,
    isLoading 
  } = useAdminDashboard()

  return (
    <>
      {/* ===== Header ===== */}
      <Header>
        <TopNav links={adminTopNav} />
        <div className='ml-auto flex flex-wrap items-center gap-2 sm:gap-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Painel Administrativo</h1>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Visão geral da plataforma Pontu AI - {format(new Date(), "dd 'de' MMMM, yyyy", { locale: pt })}
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button variant="outline" onClick={() => navigate({ to: "/admin/usuarios" })}>
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Usuários
            </Button>
            <Button onClick={() => navigate({ to: "/admin/faturas" })}>
              <FileText className="mr-2 h-4 w-4" />
              Faturas Pendentes
            </Button>
          </div>
        </div>

        {/* Visão Geral e Tarefas do Admin */}
        <div className='space-y-6'>
            {/* Cards de Estatísticas */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Card: Total de Usuários */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {stats?.totalUsers?.toLocaleString() || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    {stats?.newUsersThisMonth || 0} novos este mês
                  </p>
                </CardContent>
              </Card>
              
              {/* Card: Faturas aguardando análise */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Faturas aguardando análise</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {stats?.pendingInvoices?.toLocaleString() || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>Faturas aguardando análise manual</p>
                </CardContent>
              </Card>
            </div>

          {/* Linha 2: Gráfico de volume de faturas */}
          <div className='grid gap-4 grid-cols-1'>
            <Card>
              <CardHeader>
                <CardTitle>Volume de Faturas</CardTitle>
                <CardDescription>
                  Volume de faturas processadas nos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminOverview 
                  data={stats?.invoiceProcessingChart} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Linha 3: Lista de tarefas pendentes */}
          <div className='grid grid-cols-1 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Faturas aguardando análise</CardTitle>
                <CardDescription>Últimas faturas enviadas por usuários e aguardando análise manual do admin</CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: Substituir pelo componente real de tabela no futuro */}
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <ul className="space-y-2">
                    {(pendingInvoices?.slice(0, 5) || []).map((inv: any) => (
                      <li key={inv.id} className="flex items-center justify-between">
                        <span>
                          {inv.userName} - {inv.cardName} <span className="text-xs text-muted-foreground">{inv.createdAt ? (() => { try { return `(${format(new Date(inv.createdAt), 'dd/MM/yyyy')})` } catch { return '(data inválida)' } })() : '(data indisponível)'}</span>
                        </span>
                        <Button size="sm" variant="outline" onClick={() => navigate({ to: `/admin/faturas/${inv.id}` })}>Analisar</Button>
                      </li>
                    ))}
                    {(!pendingInvoices || pendingInvoices.length === 0) && <span className="text-xs text-muted-foreground">Nenhuma fatura pendente</span>}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}

// Navegação superior para administradores
const adminTopNav = [
  {
    title: 'Dashboard',
    href: '/',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Usuários',
    href: '/admin/usuarios',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Faturas',
    href: '/admin/faturas',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Configurações',
    href: '/configuracoes/conta',
    isActive: false,
    disabled: false,
  },
]