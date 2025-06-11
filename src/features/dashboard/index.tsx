// src/features/dashboard/index-ai.tsx
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
import { Overview } from './components/overview'
import { RecentTransactions } from './components/recent-transactions'
import { PointsStatus } from './components/points-status'
import { RecommendationsListAI } from './components/recommendations-list'
import { CreditCard, Upload, Waypoints } from 'lucide-react'
import { useDashboard } from '@/hooks/use-dashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconAlertCircle } from '@tabler/icons-react'
import { useOnboarding } from '@/hooks/use-onboarding'
import { useEffect, useState } from 'react'
import { useAnalysis } from '@/hooks/use-analysis'

export default function DashboardWithAI() {
  const navigate = useNavigate()
  const { userHasCards } = useOnboarding()
  const [hasData, setHasData] = useState<boolean | null>(null)
  
  // Verificar se o usuário tem cartões cadastrados
  useEffect(() => {
    if (userHasCards.isSuccess) {
      setHasData(userHasCards.data || false)
    }
  }, [userHasCards.isSuccess, userHasCards.data])
  
  // Buscar dados do dashboard tradicional
  const { 
    stats, 
    transactions, 
    pointsPrograms, 
    monthlySpent,
  } = useDashboard(hasData !== null ? hasData : true)
  
  // Buscar dados do serviço de análise com IA
  const {
    cardsRecommendation,
    pointsSummary
  } = useAnalysis(hasData !== null ? hasData : true)
  
  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  
  // Verificar se o usuário tem dados no dashboard
  const isEmpty = !stats.data || (
    stats.data.totalSpent === 0 && 
    stats.data.pointsEarned === 0 && 
    stats.data.activeCards === 0
  )
  
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button onClick={() => navigate({ to: "/faturas" })}>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Fatura
            </Button>
          </div>
        </div>
        
        {isEmpty && !stats.isLoading && (
          <Alert variant="default" className="mb-6">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              Parece que você ainda não tem dados registrados. Para começar a usar o sistema,
              adicione seus cartões de crédito e envie suas faturas para análise.
            </AlertDescription>
          </Alert>
        )}

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
              {/* <TabsTrigger value='points'>Pontos</TabsTrigger> */}
              <TabsTrigger value='recommendations'>Recomendações</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Gasto
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  {stats.isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {formatCurrency(stats.data?.totalSpent || 0)}
                    </div>
                  )}
                  
                  {stats.isLoading ? (
                    <Skeleton className="h-4 w-36 mt-1" />
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      {stats.data?.spentGrowth && stats.data.spentGrowth > 0 
                        ? `+${stats.data.spentGrowth}% do mês anterior` 
                        : "Nenhum dado anterior para comparação"}
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pontos Ganhos
                  </CardTitle>
                  <Waypoints className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {stats.isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {stats.data?.pointsEarned?.toLocaleString() || 0}
                    </div>
                  )}
                  
                  {stats.isLoading ? (
                    <Skeleton className="h-4 w-36 mt-1" />
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      Acumulados este mês
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Potencial de Pontos
                  </CardTitle>
                  <Waypoints className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {stats.isLoading || cardsRecommendation.isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {cardsRecommendation.data?.recommendations && cardsRecommendation.data.recommendations.length > 0 
                        ? `+${cardsRecommendation.data.recommendations[0].potential_points_increase}`
                        : (stats.data?.potentialPoints ? `+${stats.data.potentialPoints}` : 0)}
                    </div>
                  )}
                  
                  {stats.isLoading || cardsRecommendation.isLoading ? (
                    <Skeleton className="h-4 w-36 mt-1" />
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      {cardsRecommendation.data?.recommendations && cardsRecommendation.data.recommendations.length > 0 
                        ? "Aumento potencial com recomendações"
                        : (stats.data?.potentialPoints ? "+93% de oportunidade" : "Adicione cartões para ver seu potencial")}
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Cartões Ativos
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {stats.isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className='text-2xl font-bold'>
                      {stats.data?.activeCards || 0}
                    </div>
                  )}
                  
                  {stats.isLoading ? (
                    <Skeleton className="h-4 w-36 mt-1" />
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      {stats?.data?.activeCards && stats.data?.activeCards > 0 
                        ? "Nubank e Itaucard" 
                        : "Nenhum cartão cadastrado"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Visão Geral de Gastos</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview 
                    data={monthlySpent.data} 
                    isLoading={monthlySpent.isLoading} 
                  />
                </CardContent>
              </Card>
              
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                  <CardDescription>
                    Seus últimos 5 gastos com cartão.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTransactions 
                    data={transactions?.data} 
                    isLoading={transactions?.isLoading} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value='points' className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <Card className='col-span-1'>
                <CardHeader>
                  <CardTitle>Status dos Pontos</CardTitle>
                  <CardDescription>
                    Resumo dos seus pontos por programa
                  </CardDescription>
                </CardHeader>
                <CardContent className='pl-2'>
                  <PointsStatus 
                    data={pointsPrograms.data} 
                    isLoading={pointsPrograms.isLoading || pointsPrograms.isRefetching} 
                  />
                </CardContent>
              </Card>
              
              <Card className='col-span-1'>
                <CardHeader>
                  <CardTitle>Pontos a Expirar</CardTitle>
                  <CardDescription>
                    Pontos que expiram nos próximos 90 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pointsSummary.isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : pointsSummary.data?.expiring_points && pointsSummary.data.expiring_points.length > 0 ? (
                    <div className="space-y-4">
                      {pointsSummary.data.expiring_points.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{item.program}</div>
                            <div className="text-sm text-muted-foreground">
                              Expira em: {new Date(item.expiration_date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-primary">{item.amount.toLocaleString()} pts</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
                      Não há pontos com expiração próxima
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className='col-span-1 lg:col-span-2'>
                <CardHeader>
                  <CardTitle>Recomendações para seus Pontos</CardTitle>
                  <CardDescription>
                    Como aproveitar melhor seus pontos acumulados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pointsSummary.isLoading ? (
                    <Skeleton className="h-48 w-full" />
                  ) : pointsSummary.data?.recommendations ? (
                    <div className="space-y-4">
                      <Alert variant="default">
                        <IconAlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {pointsSummary.data.recommendations.message}
                        </AlertDescription>
                      </Alert>
                      
                      {pointsSummary.data.recommendations.suggested_actions && (
                        <ul className="space-y-2">
                          {pointsSummary.data.recommendations.suggested_actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <IconAlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center text-muted-foreground">
                      Adicione faturas para receber recomendações sobre seus pontos
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value='recommendations' className='space-y-4'>
            <Card className='col-span-1'>
              <CardHeader>
                <CardTitle>Recomendações Personalizadas</CardTitle>
                <CardDescription>
                  Como maximizar seus pontos com base nos seus gastos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationsListAI />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Dashboard',
    href: '/',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Cartões',
    href: '/cartoes',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Faturas',
    href: '/faturas',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Pontos',
    href: '/pontos',
    isActive: false,
    disabled: false,
  },
]