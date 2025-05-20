import {  useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { invoicesService } from '@/services/invoices-service'
import { Invoice, Transaction } from '@/types'

interface CategorySummary {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  count: number;
  points: number;
}

export const useInvoiceDetails = (invoiceId: string) => {
  // Buscar detalhes da fatura pelo ID
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['invoice-details', invoiceId],
    queryFn: () => invoicesService.getInvoiceDetails(invoiceId).then(res => res.data),
    enabled: !!invoiceId,
  })

  // Extrair dados da resposta
  const invoice: Invoice | undefined = data?.invoice
  const transactions: Transaction[] | undefined = data?.transactions

  // Nome formatado do cartão
  const cardName = useMemo(() => {
    if (!invoice?.card) return 'Cartão não encontrado'
    return `${invoice.card.name}`
  }, [invoice])

  // Agrupar transações por categoria para o resumo
  const summaryByCategory: CategorySummary[] = useMemo(() => {
    if (!transactions) return []

    const categories: Record<string, CategorySummary> = {}
    
    // Agrupar transações por categoria
    transactions.forEach(tx => {
      const categoryId = tx.category?.id || 'uncategorized'
      const categoryName = tx.category?.name || 'Não categorizado'
      const categoryIcon = tx.category_icon || 'help-circle'
      const categoryColor = tx.category_color || 'gray'
      
      if (!categories[categoryId]) {
        categories[categoryId] = {
          id: categoryId,
          name: categoryName,
          icon: categoryIcon,
          color: categoryColor,
          total: 0,
          count: 0,
          points: 0
        }
      }
      
      categories[categoryId].total += tx.amount
      categories[categoryId].count++
      categories[categoryId].points += tx.points_earned || 0
    })
    
    // Converter objeto para array e ordenar por valor total
    return Object.values(categories).sort((a, b) => b.total - a.total)
  }, [transactions])

  return {
    invoice,
    transactions,
    isLoading,
    error,
    refetch,
    cardName,
    summaryByCategory
  }
}