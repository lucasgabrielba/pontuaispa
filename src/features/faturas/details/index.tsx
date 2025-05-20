import { useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowLeft, IconFileText, IconCreditCard, IconDownload } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from '@tanstack/react-router'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconAlertCircle } from "@tabler/icons-react"
import { useInvoiceDetails } from '@/hooks/use-invoice-details'
import { CategoryIcon } from '@/components/category-icon'
import { TransactionsList } from './components/transactions-list'
import { useMemo } from 'react'

export function InvoiceDetails() {
  const params = useParams({ from: '/_authenticated/faturas/$invoiceId' })
  const navigate = useNavigate()
  const invoiceId = params.invoiceId

  const {
    invoice,
    transactions,
    isLoading,
    error,
    cardName,
    summaryByCategory,
    params: filterParams,
    updateParams
  } = useInvoiceDetails(invoiceId)

  // Extrair categorias únicas do resumo por categoria para o filtro
  const categories = useMemo(() => {
    return summaryByCategory.map(category => ({
      id: category.id || 'uncategorized',
      name: category.name
    }));
  }, [summaryByCategory]);

  // Função para formatar a data
  function formatDate(dateString?: string) {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: pt })
    } catch (e) {
      console.error('Erro ao formatar a data:', e)
      return dateString
    }
  }

  // Função para obter variante do status
  function getStatusVariant(status: string) {
    switch (status) {
      case 'Analisado':
        return 'default'
      case 'Processando':
        return 'secondary'
      case 'Erro':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  // Cálculo de totais
  const totalAmount = invoice?.total_amount || 0
  const totalPoints = transactions?.data?.reduce((sum: any, tx: any) => sum + (tx.points_earned || 0), 0) || 0
  const avgPointsPerTransaction = transactions?.data?.length
    ? (totalPoints / transactions.data.length).toFixed(1)
    : '0'

  // Manipuladores para os filtros e paginação
  const handlePaginationChange = (page: number) => {
    updateParams({ page });
  };

  const handleSearchChange = (search: string) => {
    updateParams({ search, page: 1 });
  };

  const handleSortChange = (field: 'date' | 'amount' | 'merchant', order: 'asc' | 'desc') => {
    updateParams({ sortField: field, sortOrder: order });
  };

  const handleCategoryFilterChange = (category: string) => {
    updateParams({ categoryFilter: category, page: 1 });
  };

  return (
    <>
      <Header>
        <div className='flex items-center gap-2'>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate({ to: "/faturas" })}
          >
            <IconArrowLeft size={18} />
            Voltar para Faturas
          </Button>
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {isLoading ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </>
        ) : error ? (
          <Alert variant="destructive">
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar dados da fatura. Por favor, tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
                  <IconFileText size={24} />
                  Fatura {formatDate(invoice?.reference_date)}
                </h1>
                <p className='text-muted-foreground'>
                  Detalhes da fatura e transações
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getStatusVariant(invoice?.status || 'Processando')}>
                  {invoice?.status || 'Processando'}
                </Badge>
                <Button variant="outline" size="sm">
                  <IconDownload className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cartão</CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  <div className="flex items-center gap-2">
                    <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-bold">{cardName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Final {invoice?.card?.last_digits || '****'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  <div className="text-xl font-bold">
                    R$ {totalAmount.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {transactions?.total || 0} transações
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pontos Ganhos</CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  <div className="text-xl font-bold">
                    {totalPoints.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Média de {avgPointsPerTransaction} por transação
                  </p>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Datas</CardTitle>
                </CardHeader>
                <CardContent className="pt-1 space-y-2">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                    <span className="text-muted-foreground">Vencimento:</span>
                    <span>{formatDate(invoice?.due_date)}</span>
                    
                    <span className="text-muted-foreground">Fechamento:</span>
                    <span>{formatDate(invoice?.closing_date)}</span>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Transações</CardTitle>
                  <CardDescription>
                    Lista de todas as transações da fatura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions && (
                    <TransactionsList
                      transactions={transactions}
                      onPaginationChange={handlePaginationChange}
                      onSearchChange={handleSearchChange}
                      onSortChange={handleSortChange}
                      onCategoryFilterChange={handleCategoryFilterChange}
                      sortField={filterParams.sortField || 'date'}
                      sortOrder={filterParams.sortOrder || 'desc'}
                      categoryFilter={filterParams.categoryFilter || 'all'}
                      categories={categories}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo por Categoria</CardTitle>
                  <CardDescription>
                    Distribuição de gastos por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summaryByCategory?.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        Nenhuma categoria disponível
                      </div>
                    ) : (
                      summaryByCategory?.map((category) => (
                        <div key={category.id || 'uncategorized'} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CategoryIcon
                                iconName={category.icon || 'help-circle'}
                                color={category.color || 'gray'}
                                size={16}
                              />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <span className="font-medium">
                              R$ {category.total.toFixed(2)}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${(category.total / totalAmount) * 100}%`,
                                backgroundColor: category.color ? `hsl(var(--${category.color}))` : undefined
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{category.count} transações</span>
                            <span>{category.points.toLocaleString()} pontos</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Oportunidades de Pontos</CardTitle>
                <CardDescription>
                  Como você poderia ter acumulado mais pontos nesta fatura
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions && transactions.data.some((tx: any) => tx.is_recommended) ? (
                  <div className="space-y-4">
                    <Alert>
                      <IconAlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Você poderia ter acumulado até <strong>30% mais pontos</strong> usando cartões mais adequados para suas categorias de gastos.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <p className="font-medium">Recomendações:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Use o cartão <strong>Nubank Platinum</strong> para gastos em Restaurantes (2x mais pontos)</li>
                        <li>Use o cartão <strong>Itaú Personnalité</strong> para gastos em Supermercados (1.8x mais pontos)</li>
                        <li>Considere adicionar o <strong>Santander Select</strong> para gastos em Combustível</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Não encontramos oportunidades de melhorias para esta fatura.
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Main>
    </>
  )
}