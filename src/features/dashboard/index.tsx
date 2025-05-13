/**
 * src/features/dashboard/index.tsx - Arquivo principal da Dashboard
 * 
 * Este arquivo importa os componentes necessários e exporta a Dashboard completa
 */
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
import { RecommendationsList } from './components/recommendations-list'
import { CreditCard, Upload, Waypoints } from 'lucide-react'

export default function Dashboard() {
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
            <Button onClick={() => window.location.href="/faturas/upload"}>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Fatura
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
              <TabsTrigger value='points'>Pontos</TabsTrigger>
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
                  <div className='text-2xl font-bold'>R$ 3.521,89</div>
                  <p className='text-xs text-muted-foreground'>
                    +12.5% do mês anterior
                  </p>
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
                  <div className='text-2xl font-bold'>1.258</div>
                  <p className='text-xs text-muted-foreground'>
                    Acumulados este mês
                  </p>
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
                  <div className='text-2xl font-bold'>+2.431</div>
                  <p className='text-xs text-muted-foreground'>
                    +93% de oportunidade
                  </p>
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
                  <div className='text-2xl font-bold'>2</div>
                  <p className='text-xs text-muted-foreground'>
                    Nubank e Itaucard
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Visão Geral de Gastos</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
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
                  <RecentTransactions />
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
                  <PointsStatus />
                </CardContent>
              </Card>
              <Card className='col-span-1'>
                <CardHeader>
                  <CardTitle>Histórico de Pontos</CardTitle>
                  <CardDescription>
                    Evolução dos pontos nos últimos 6 meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
                    Gráfico de histórico de pontos será exibido aqui
                  </div>
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-2'>
                <CardHeader>
                  <CardTitle>Onde você mais acumula pontos</CardTitle>
                  <CardDescription>
                    Principais estabelecimentos e categorias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
                    Detalhamento de pontos por estabelecimento/categoria será exibido aqui
                  </div>
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
                <RecommendationsList />
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