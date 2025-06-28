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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconArrowLeft, IconFileText, IconCreditCard, IconDownload, IconChartBar, IconBulb, IconList } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconAlertCircle } from "@tabler/icons-react"
import { CategoryIcon } from '@/components/category-icon'
import { TransactionsList } from './components/transactions-list'
import { SuggestionSheet } from './components/suggestion-sheet'
import { SuggestionsSection } from './components/suggestions-section'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { invoicesService } from '@/services/invoices-service'

// Definir os parâmetros de pesquisa para a rota
interface SearchParams {
  page?: string;
  search?: string;
  sortField?: 'date' | 'amount' | 'merchant';
  sortOrder?: 'asc' | 'desc';
  category?: string;
  tab?: string;
}

// Função para converter valores inteiros em valores reais
function convertIntToDecimal(intValue: number): number {
  return intValue / 100;
}

interface InvoiceDetailsProps {
  invoiceId?: string;
}

import { useLocation } from '@tanstack/react-router';

export function InvoiceDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin/');
  const params = useParams({ from: isAdmin ? '/_authenticated/admin/faturas/$invoiceId' : '/_authenticated/faturas/$invoiceId' });
  const invoiceId = params.invoiceId;

  // Obter parâmetros da URL
  const searchParams = useSearch<SearchParams>({ from: isAdmin ? '/_authenticated/admin/faturas/$invoiceId' : '/_authenticated/faturas/$invoiceId' });

  // Estados iniciais baseados nos parâmetros da URL
  const [filterParams, setFilterParams] = useState({
    page: parseInt(searchParams?.page || '1'),
    perPage: 15,
    search: searchParams?.search || '',
    sortField: (searchParams?.sortField || 'date') as 'date' | 'amount' | 'merchant',
    sortOrder: (searchParams?.sortOrder || 'desc') as 'asc' | 'desc',
    categoryFilter: searchParams?.category || 'all'
  });

  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState(searchParams?.tab || 'transactions');

  // Atualizar os parâmetros de filtro na URL
  const updateUrlParams = useCallback((newParams: Partial<typeof filterParams & { tab?: string }>) => {
    const currentParams = { ...filterParams, ...newParams };

    const urlSearchParams: SearchParams = {};

    // Adicionar apenas parâmetros com valores não padrão na URL
    if (currentParams.page !== 1) urlSearchParams.page = currentParams.page.toString();
    if (currentParams.search) urlSearchParams.search = currentParams.search;
    if (currentParams.sortField !== 'date') urlSearchParams.sortField = currentParams.sortField;
    if (currentParams.sortOrder !== 'desc') urlSearchParams.sortOrder = currentParams.sortOrder;
    if (currentParams.categoryFilter !== 'all') urlSearchParams.category = currentParams.categoryFilter;
    if (newParams.tab && newParams.tab !== 'transactions') urlSearchParams.tab = newParams.tab;

    // Navegar para a mesma rota com os novos parâmetros de consulta
    navigate({
      to: '/faturas/$invoiceId',
      params: { invoiceId },
      search: Object.keys(urlSearchParams).length > 0 ? urlSearchParams : undefined,
      replace: true // Substituir em vez de adicionar ao histórico
    });
  }, [filterParams, invoiceId, navigate]);

  // Função para atualizar os parâmetros de filtro
  const updateParams = useCallback((newParams: Partial<typeof filterParams>) => {
    setFilterParams(prev => {
      const updated = { ...prev, ...newParams };
      return updated;
    });

    // Atualizar os parâmetros na URL
    updateUrlParams(newParams);
  }, [updateUrlParams]);

  // Função para mudar de aba
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    updateUrlParams({ tab });
  }, [updateUrlParams]);

  // Efeito para sincronizar o estado local com os parâmetros da URL quando mudam
  useEffect(() => {
    const page = parseInt(searchParams?.page || '1');
    const search = searchParams?.search || '';
    const sortField = (searchParams?.sortField || 'date') as 'date' | 'amount' | 'merchant';
    const sortOrder = (searchParams?.sortOrder || 'desc') as 'asc' | 'desc';
    const categoryFilter = searchParams?.category || 'all';
    const tab = searchParams?.tab || 'transactions';

    // Verificar se os parâmetros da URL são diferentes dos locais
    if (
      page !== filterParams.page ||
      search !== filterParams.search ||
      sortField !== filterParams.sortField ||
      sortOrder !== filterParams.sortOrder ||
      categoryFilter !== filterParams.categoryFilter ||
      tab !== activeTab
    ) {
      setFilterParams({
        page,
        perPage: 15,
        search,
        sortField,
        sortOrder,
        categoryFilter
      });
      setActiveTab(tab);
    }
  }, [searchParams, filterParams, activeTab]);

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

  // Consultas
  const {
    data: invoice,
    isLoading: isLoadingInvoice,
    error: invoiceError,
  } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => invoicesService.getInvoice(invoiceId).then(res => res.data),
    enabled: !!invoiceId,
  });

  // Transformação dos dados da API para o formato correto
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
    queryKey: ['invoice-transactions', invoiceId, filterParams],
    queryFn: () => {
      const apiParams = getApiParams();
      return invoicesService.getInvoiceTransactions(invoiceId, apiParams)
        .then(res => {
          // Transformar os valores inteiros em decimais
          const transformedData = {
            ...res.data,
            data: res.data.data.map((tx: any) => ({
              ...tx,
              amount: convertIntToDecimal(tx.amount),
              // Se points_earned for um número inteiro, mantemos como está
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
    queryKey: ['invoice-category-summary', invoiceId],
    queryFn: () => invoicesService.getInvoiceCategorySummary(invoiceId).then(res => res.data),
    enabled: !!invoiceId,
  });

  // Transformação do resumo de categorias para valores decimais
  const summaryByCategory = useMemo(() => {
    if (!summaryByCategoryRaw) return null;

    return summaryByCategoryRaw.map((category: any) => ({
      ...category,
      total: convertIntToDecimal(category.total)
    }));
  }, [summaryByCategoryRaw]);

  // Cálculos memorizados
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

  // Manipuladores de eventos
  const handlePaginationChange = useCallback((page: any) => {
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
                  Fatura {formatDate(transformedInvoice?.reference_date)}
                </h1>
                <p className='text-muted-foreground'>
                  Detalhes da fatura e transações
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getStatusVariant(transformedInvoice?.status || 'Processando')}>
                  {transformedInvoice?.status || 'Processando'}
                </Badge>
                {isAdmin && (
                  <SuggestionSheet 
                    invoiceId={invoiceId} 
                    className="bg-primary text-primary-foreground"
                  />
                )}
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
                  <CardTitle className="text-sm font-medium">Data de Referência</CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                  <div className="text-xl font-bold">
                    {formatDate(transformedInvoice?.reference_date)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vencimento: {formatDate(transformedInvoice?.due_date)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList className="w-auto">
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <IconList size={16} />
                  Transações
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <IconChartBar size={16} />
                  Análises
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex items-center gap-2">
                  <IconBulb size={16} />
                  Sugestões
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transações</CardTitle>
                    <CardDescription>
                      Lista de todas as transações da fatura ({transactionsData?.total || 0} transações)
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
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
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
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <SuggestionsSection invoiceId={invoiceId} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </Main>
    </>
  )
}