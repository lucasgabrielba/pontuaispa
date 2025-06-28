//@ts-nocheck
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Search } from "@/components/search"
import { ThemeSwitch } from "@/components/theme-switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowLeft, IconFileText, IconCreditCard, IconDownload, IconPlus, IconSettings } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconAlertCircle } from "@tabler/icons-react"
import { CategoryIcon } from '@/components/category-icon'
import { TransactionsList } from '@/features/faturas/details/components/transactions-list'
import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { invoicesService } from '@/services/invoices-service'
import { adminInvoicesService } from '@/services/admin-invoices-service'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TopNav } from '@/components/layout/top-nav'
import { SuggestionsList } from './components/suggestions-list'
import { SuggestionSheet } from './components/suggestion-sheet'
import { MessageSquare } from 'lucide-react'

// Definir os parâmetros de pesquisa para a rota
interface SearchParams {
  page?: string;
  search?: string;
  sortField?: 'date' | 'amount' | 'merchant';
  sortOrder?: 'asc' | 'desc';
  category?: string;
}

// Função para converter valores inteiros em valores reais
function convertIntToDecimal(intValue: number): number {
  return intValue / 100;
}

export function AdminInvoiceDetails() {
  const navigate = useNavigate();
  const params = useParams({ from: '/_authenticated/admin/faturas/$invoiceId' });
  const invoiceId = params.invoiceId;

  // Estados para suggestions
  const [isSuggestionSheetOpen, setIsSuggestionSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  // Obter parâmetros da URL (reutilizando a mesma lógica da página de usuário)
  const searchParams = useSearch<SearchParams>({ from: '/_authenticated/admin/faturas/$invoiceId' });

  // Estados iniciais baseados nos parâmetros da URL
  const [filterParams, setFilterParams] = useState({
    page: parseInt(searchParams?.page || '1'),
    perPage: 15,
    search: searchParams?.search || '',
    sortField: (searchParams?.sortField || 'date') as 'date' | 'amount' | 'merchant',
    sortOrder: (searchParams?.sortOrder || 'desc') as 'asc' | 'desc',
    categoryFilter: searchParams?.category || 'all'
  });

  // Atualizar os parâmetros de filtro na URL
  const updateUrlParams = useCallback((newParams: Partial<typeof filterParams>) => {
    const currentParams = { ...filterParams, ...newParams };

    const urlSearchParams: SearchParams = {};

    if (currentParams.page !== 1) urlSearchParams.page = currentParams.page.toString();
    if (currentParams.search) urlSearchParams.search = currentParams.search;
    if (currentParams.sortField !== 'date') urlSearchParams.sortField = currentParams.sortField;
    if (currentParams.sortOrder !== 'desc') urlSearchParams.sortOrder = currentParams.sortOrder;
    if (currentParams.categoryFilter !== 'all') urlSearchParams.category = currentParams.categoryFilter;

    navigate({
      to: '/admin/faturas/$invoiceId',
      params: { invoiceId },
      search: Object.keys(urlSearchParams).length > 0 ? urlSearchParams : undefined,
      replace: true
    });
  }, [filterParams, invoiceId, navigate]);

  // Função para atualizar os parâmetros de filtro
  const updateParams = useCallback((newParams: Partial<typeof filterParams>) => {
    setFilterParams(prev => {
      const updated = { ...prev, ...newParams };
      return updated;
    });
    updateUrlParams(newParams);
  }, [updateUrlParams]);

  // Converter parâmetros para formato da API
  const getApiParams = useCallback(() => {
    const apiSortFields = {
      'date': 'transaction_date',
      'amount': 'amount',
      'merchant': 'merchant_name'
    };

    return {
      page: filterParams.page,
      per_page: filterParams.perPage,
      search: filterParams.search,
      sort_field: apiSortFields[filterParams.sortField] || 'transaction_date',
      sort_order: filterParams.sortOrder || 'desc',
      category_filter: filterParams.categoryFilter || 'all'
    };
  }, [filterParams]);

  // Consultas (reutilizando as mesmas da página de usuário)
  const {
    data: invoice,
    isLoading: isLoadingInvoice,
    error: invoiceError,
  } = useQuery({
    queryKey: ['admin-invoice', invoiceId],
    queryFn: async () => {
      try {
        const res = await invoicesService.getInvoice(invoiceId);
        return res.data;
      } catch (error) {
        console.error('Erro ao buscar fatura:', error);
        // Mock para ambiente de desenvolvimento
        return {
          id: invoiceId,
          card_name: 'Mock Card',
          card_last_digits: '1234',
          reference_date: '2024-01-01T00:00:00Z',
          status: 'Analisado',
          total_amount: 123456,
          created_at: '2024-01-01T00:00:00Z',
          transactions_count: 10,
          // Adicione outros campos necessários para o funcionamento da tela
        };
      }
    },
    enabled: !!invoiceId,
  });

  const transformedInvoice = useMemo(() => {
    if (!invoice) return null;

    return {
      ...invoice,
      total_amount: convertIntToDecimal(invoice.total_amount),
    };
  }, [invoice]);

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ['admin-invoice-transactions', invoiceId, filterParams],
    queryFn: () => {
      const apiParams = getApiParams();
      return invoicesService.getInvoiceTransactions(invoiceId, apiParams)
        .then(res => {
          const transformedData = {
            ...res.data,
            data: res.data.data.map((tx: any) => ({
              ...tx,
              amount: convertIntToDecimal(tx.amount),
              points_earned: tx.points_earned
            }))
          };

          return transformedData;
        });
    },
    enabled: !!invoiceId,
  });

  const {
    data: summaryByCategoryRaw,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useQuery({
    queryKey: ['admin-invoice-category-summary', invoiceId],
    queryFn: () => invoicesService.getInvoiceCategorySummary(invoiceId).then(res => res.data),
    enabled: !!invoiceId,
  });

  const summaryByCategory = useMemo(() => {
    if (!summaryByCategoryRaw) return null;

    return summaryByCategoryRaw.map((category: any) => ({
      ...category,
      total: convertIntToDecimal(category.total)
    }));
  }, [summaryByCategoryRaw]);

  // Query para buscar sugestões existentes
  const {
    data: suggestions,
    isLoading: isLoadingSuggestions,
    refetch: refetchSuggestions
  } = useQuery({
    queryKey: ['admin-invoice-suggestions', invoiceId],
    queryFn: () => adminInvoicesService.getInvoiceSuggestions(invoiceId).then(res => res.data),
    enabled: !!invoiceId,
  });

  // Cálculos memorizados (mesmo da página de usuário)
  const cardName = useMemo(() => {
    if (!transformedInvoice?.card) return 'Cartão não encontrado';
    return `${transformedInvoice.card.name}`;
  }, [transformedInvoice]);

  const categories = useMemo(() => {
    if (!summaryByCategory) return [];
    return summaryByCategory.map((category: any) => ({
      id: category.id || 'uncategorized',
      name: category.name
    }));
  }, [summaryByCategory]);

  const totalAmount = useMemo(() => {
    return transformedInvoice?.total_amount || 0;
  }, [transformedInvoice]);

  const totalPoints = useMemo(() => {
    if (!transactionsData?.data) return 0;
    return transactionsData.data.reduce((sum: number, tx: any) => sum + (tx.points_earned || 0), 0);
  }, [transactionsData]);

  const avgPointsPerTransaction = useMemo(() => {
    if (!transactionsData?.data || transactionsData.data.length === 0) return '0';
    return (totalPoints / transactionsData.data.length).toFixed(1);
  }, [transactionsData, totalPoints]);

  // Estado de carregamento e erro
  const isLoading = isLoadingInvoice || isLoadingTransactions || isLoadingSummary;
  const error = invoiceError || transactionsError || summaryError;

  // Funções de utilidade
  function formatDate(dateString: string) {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: pt })
    } catch (e) {
      console.error('Erro ao formatar a data:', e)
      return dateString
    }
  }

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

  // Manipuladores de eventos (mesmos da página de usuário)
  const handlePaginationChange = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  const handleSearchChange = useCallback((search: string) => {
    updateParams({ search, page: 1 });
  }, [updateParams]);

  const handleSortChange = useCallback((field: string, order: string) => {
    updateParams({ sortField: field as 'date' | 'amount' | 'merchant', sortOrder: order as 'desc' | 'asc' });
  }, [updateParams]);

  const handleCategoryFilterChange = useCallback((category: string) => {
    updateParams({ categoryFilter: category, page: 1 });
  }, [updateParams]);

  return (
    <>
      <Header>
        <TopNav links={adminTopNav} />
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
                <div className='flex items-center space-x-4 mb-2'>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: "/admin/faturas" })}
                  >
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Faturas
                  </Button>
                </div>
                <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
                  <IconFileText size={24} />
                  [ADMIN] Fatura {formatDate(transformedInvoice?.reference_date)}
                </h1>
                <p className='text-muted-foreground'>
                  Detalhes administrativos da fatura e gestão de sugestões
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getStatusVariant(transformedInvoice?.status || 'Processando')}>
                  {transformedInvoice?.status || 'Processando'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSuggestionSheetOpen(true)}
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Nova Sugestão
                </Button>
              </div>
            </div>

            {/* Cards de informações (reutilizados) */}
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
                    Final {transformedInvoice?.card?.last_digits || '****'}
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
                    {transactionsData?.total || 0} transações
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

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sugestões</CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  <div className="text-xl font-bold">
                    {isLoadingSuggestions ? '...' : (suggestions?.length || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recomendações criadas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs para organizar conteúdo */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <IconFileText className="h-4 w-4" />
                  Detalhes da Fatura
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Sugestões ({suggestions?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <IconSettings className="h-4 w-4" />
                  Ferramentas Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Transações</CardTitle>
                      <CardDescription>
                        Lista de todas as transações da fatura
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {transactionsData && (
                        <TransactionsList
                          transactions={transactionsData}
                          onPaginationChange={handlePaginationChange}
                          onSearchChange={handleSearchChange}
                          onSortChange={handleSortChange}
                          onCategoryFilterChange={handleCategoryFilterChange}
                          sortField={filterParams.sortField}
                          sortOrder={filterParams.sortOrder}
                          categoryFilter={filterParams.categoryFilter}
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
                          summaryByCategory?.map((category: any) => (
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
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-6">
                <SuggestionsList
                  invoiceId={invoiceId}
                  suggestions={suggestions}
                  isLoading={isLoadingSuggestions}
                  onRefetch={refetchSuggestions}
                  onCreateNew={() => setIsSuggestionSheetOpen(true)}
                />
              </TabsContent>

              <TabsContent value="admin" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ferramentas Administrativas</CardTitle>
                    <CardDescription>
                      Ações especiais para administradores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Button variant="outline" className="justify-start">
                        <IconSettings className="mr-2 h-4 w-4" />
                        Reprocessar Fatura
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <IconDownload className="mr-2 h-4 w-4" />
                        Exportar Dados
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Ver Logs
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <IconAlertCircle className="mr-2 h-4 w-4" />
                        Marcar como Problema
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Sheet para criar sugestões */}
            <SuggestionSheet
              open={isSuggestionSheetOpen}
              onOpenChange={setIsSuggestionSheetOpen}
              invoiceId={invoiceId}
              onSuccess={() => {
                refetchSuggestions()
                setIsSuggestionSheetOpen(false)
              }}
            />
          </>
        )}
      </Main>
    </>
  )
}

// Navegação superior para administradores
const adminTopNav = [
  {
    title: 'Dashboard',
    href: '/admin',
    isActive: false,
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
    isActive: true,
    disabled: false,
  },
  {
    title: 'Configurações',
    href: '/configuracoes/conta',
    isActive: false,
    disabled: false,
  },
]