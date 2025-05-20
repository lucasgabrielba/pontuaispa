import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { invoicesService } from '@/services/invoices-service'
import { Invoice } from '@/types'

interface CategorySummary {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  count: number;
  points: number;
}

interface InvoiceDetailsParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortField?: 'date' | 'amount' | 'merchant';
  sortOrder?: 'asc' | 'desc';
  categoryFilter?: string;
}

export const useInvoiceDetails = (invoiceId: string) => {
  const [params, setParams] = useState<InvoiceDetailsParams>({
    page: 1,
    perPage: 15,
    search: '',
    sortField: 'date',
    sortOrder: 'desc',
    categoryFilter: 'all'
  });

  // Converter parâmetros para formato da API
  const getApiParams = useCallback(() => {
    const apiSortFields: Record<string, string> = {
      'date': 'transaction_date',
      'amount': 'amount',
      'merchant': 'merchant_name'
    };

    return {
      page: params.page,
      per_page: params.perPage,
      search: params.search,
      sort_field: apiSortFields[params.sortField || 'date'],
      sort_order: params.sortOrder,
      category_filter: params.categoryFilter
    };
  }, [params]);

  // Buscar detalhes da fatura pelo ID
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['invoice-details', invoiceId, params],
    queryFn: () => invoicesService.getInvoiceDetails(invoiceId, getApiParams()).then(res => res.data),
    enabled: !!invoiceId,
  });

  // Extrair dados da resposta
  const invoice: Invoice | undefined = data?.invoice;
  const transactions = data?.transactions;
  const summaryByCategory: CategorySummary[] = data?.summaryByCategory || [];

  // Nome formatado do cartão
  const cardName = useMemo(() => {
    if (!invoice?.card) return 'Cartão não encontrado';
    return `${invoice.card.name}`;
  }, [invoice]);

  // Função para atualizar parâmetros de paginação e filtro
  const updateParams = useCallback((newParams: Partial<InvoiceDetailsParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  return {
    invoice,
    transactions,
    summaryByCategory,
    isLoading,
    error,
    refetch,
    cardName,
    params,
    updateParams
  };
};