import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { invoicesService } from '@/services/invoices-service'

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
    data: invoice,
    isLoading: isLoadingInvoice,
    error: invoiceError,
    refetch: refetchInvoice
  } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => invoicesService.getInvoice(invoiceId).then(res => res.data),
    enabled: !!invoiceId,
  });

  // Buscar transações
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['invoice-transactions', invoiceId, params],
    queryFn: () => invoicesService.getInvoiceTransactions(invoiceId, getApiParams()).then(res => res.data),
    enabled: !!invoiceId,
  });

  // Buscar resumo por categoria
  const {
    data: summaryByCategory,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['invoice-category-summary', invoiceId],
    queryFn: () => invoicesService.getInvoiceCategorySummary(invoiceId).then(res => res.data),
    enabled: !!invoiceId,
  });

  const cardName = useMemo(() => {
    if (!invoice?.card) return 'Cartão não encontrado';
    return `${invoice.card.name}`;
  }, [invoice]);

  const isLoading = isLoadingInvoice || isLoadingTransactions || isLoadingSummary;
  
  const error = invoiceError || transactionsError || summaryError;

  const updateParams = useCallback((newParams: Partial<InvoiceDetailsParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const refetchAll = useCallback(() => {
    refetchInvoice();
    refetchTransactions();
    refetchSummary();
  }, [refetchInvoice, refetchTransactions, refetchSummary]);

  return {
    invoice,
    transactions,
    summaryByCategory: summaryByCategory || [],
    isLoading,
    error,
    refetchAll,
    cardName,
    params,
    updateParams
  };
};