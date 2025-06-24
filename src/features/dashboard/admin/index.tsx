import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { 
  Users, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Download
} from 'lucide-react'
import { useAdminDashboard } from '@/hooks/use-admin-dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { AdminOverview } from './components/admin-overview'
import { SystemHealthCard } from './components/system-health-card'

export default function AdminDashboard() {
  const navigate = useNavigate()
  
  // Hook customizado para dados administrativos
  const { 
    stats, 
    users, 
    pendingInvoices,
    systemHealth,
    isLoading 
  } = useAdminDashboard()

  return (
    <>
      {/* ===== Header ===== */}
      <Header>
        <TopNav links={adminTopNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Relatório
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Painel Administrativo</h1>
            <p className='text-muted-foreground'>
              Visão geral da plataforma Pontu AI - {format(new Date(), "dd 'de' MMMM, yyyy", { locale: pt })}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant="outline" onClick={() => navigate({ to: "/admin/usuarios" })}>
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Usuários
            </Button>
            <Button onClick={() => navigate({ to: "/admin/invoices" })}>
              <FileText className="mr-2 h-4 w-4" />
              Faturas Pendentes
            </Button>
          </div>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
              <TabsTrigger value='users'>Usuários</TabsTrigger>
              <TabsTrigger value='invoices'>Faturas</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value='overview' className='space-y-6'>
            {/* Cards de Estatísticas */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de Usuários
                  </CardTitle>
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
              
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Faturas Pendentes
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold text-amber-600'>
                      {stats?.pendingInvoices || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Aguardando análise
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Faturas Processadas
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold text-green-600'>
                      {stats?.processedInvoices || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Neste mês
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Recomendações Geradas
                  </CardTitle>
                  <Brain className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold text-primary'>
                      {stats?.recommendationsGenerated || 0}
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    +{stats?.recommendationsGrowth || 0}% vs mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos e Tabelas */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
              <Card className='lg:col-span-2'>
                <CardHeader>
                  <CardTitle>Processamento de Faturas</CardTitle>
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
              
              <Card>
                <CardHeader>
                  <CardTitle>Status do Sistema</CardTitle>
                  <CardDescription>
                    Saúde dos serviços da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SystemHealthCard 
                    data={systemHealth} 
                    isLoading={isLoading} 
                  />
                </CardContent>
              </Card>
            </div>

            {/* Usuários Recentes e Faturas Críticas */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Novos Usuários</CardTitle>
                  <CardDescription>
                    Últimos usuários cadastrados na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <UsersTable 
                    users={users?.slice(0, 5)} 
                    isLoading={isLoading}
                    showActions={false}
                  /> */}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Faturas Críticas</CardTitle>
                  <CardDescription>
                    Faturas com problemas ou há mais tempo na fila
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <PendingInvoicesTable 
                    invoices={pendingInvoices?.filter(inv => inv.priority === 'high')?.slice(0, 5)} 
                    isLoading={isLoading}
                    compact={true}
                  /> */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value='users' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <UsersTable 
                  users={users} 
                  isLoading={isLoading}
                  showActions={true}
                /> */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value='invoices' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Faturas Pendentes</CardTitle>
                <CardDescription>
                  Faturas aguardando processamento e análise
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <PendingInvoicesTable 
                  invoices={pendingInvoices} 
                  isLoading={isLoading}
                  compact={false}
                /> */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <div className='grid gap-6'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-base'>Taxa de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold text-green-600'>
                      {stats?.conversionRate || 0}%
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Visitantes que se cadastram
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-base'>Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold text-blue-600'>
                      {stats?.avgInvoicesPerUser || 0}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Faturas por usuário/mês
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-base'>Tempo Médio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold text-purple-600'>
                      {stats?.avgProcessingTime || 0}min
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Processamento de faturas
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Desempenho</CardTitle>
                  <CardDescription>
                    Indicadores chave de performance da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span>Usuários Ativos (30d)</span>
                          <span className='font-medium'>{stats?.activeUsers || 0}</span>
                        </div>
                        <div className='h-2 w-full bg-secondary rounded-full overflow-hidden'>
                          <div 
                            className='h-full bg-primary rounded-full transition-all'
                            style={{ width: `${((stats?.activeUsers || 0) / (stats?.totalUsers || 1)) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span>Taxa de Sucesso IA</span>
                          <span className='font-medium'>{stats?.aiSuccessRate || 0}%</span>
                        </div>
                        <div className='h-2 w-full bg-secondary rounded-full overflow-hidden'>
                          <div 
                            className='h-full bg-green-500 rounded-full transition-all'
                            style={{ width: `${stats?.aiSuccessRate || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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
    href: '/admin/users',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Faturas',
    href: '/admin/invoices',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    isActive: false,
    disabled: false,
  },
]