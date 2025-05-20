// src/features/faturas/details/components/transactions-list.tsx
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { CategoryIcon } from '@/components/category-icon'
import { 
  Input 
} from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconSearch, IconFilter, IconArrowUp, IconArrowDown, IconStar } from "@tabler/icons-react"
import { Transaction } from '@/types'

interface TransactionsListProps {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'date' | 'amount' | 'merchant'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Extrair categorias únicas para o filtro
  const uniqueCategories = Array.from(
    new Set(transactions.map(tx => tx.category?.name || 'Sem categoria'))
  ).sort()

  // Filtrar e ordenar transações
  const filteredTransactions = transactions
    .filter(tx => {
      // Aplicar filtro de pesquisa
      const matchesSearch = tx.merchant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Aplicar filtro de categoria
      const matchesCategory = categoryFilter === 'all' || 
        tx.category?.name === categoryFilter ||
        (!tx.category?.name && categoryFilter === 'Sem categoria')
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Aplicar ordenação
      if (sortField === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
          : new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
      }
      
      if (sortField === 'amount') {
        return sortOrder === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount
      }
      
      // merchant_name
      return sortOrder === 'asc'
        ? a.merchant_name.localeCompare(b.merchant_name)
        : b.merchant_name.localeCompare(a.merchant_name)
    })

  // Função para alternar a ordenação
  const toggleSort = (field: 'date' | 'amount' | 'merchant') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Função para formatar data
  const formatTransactionDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM', { locale: pt })
    } catch (e) {
      console.log(e);
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar transações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <IconFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma transação encontrada
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 -ml-3 font-medium"
                    onClick={() => toggleSort('date')}
                  >
                    Data
                    {sortField === 'date' && (
                      sortOrder === 'asc' 
                        ? <IconArrowUp className="inline ml-1 h-3 w-3" /> 
                        : <IconArrowDown className="inline ml-1 h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 -ml-3 font-medium"
                    onClick={() => toggleSort('merchant')}
                  >
                    Estabelecimento
                    {sortField === 'merchant' && (
                      sortOrder === 'asc' 
                        ? <IconArrowUp className="inline ml-1 h-3 w-3" /> 
                        : <IconArrowDown className="inline ml-1 h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">Categoria</TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 -ml-3 font-medium"
                    onClick={() => toggleSort('amount')}
                  >
                    Valor
                    {sortField === 'amount' && (
                      sortOrder === 'asc' 
                        ? <IconArrowUp className="inline ml-1 h-3 w-3" /> 
                        : <IconArrowDown className="inline ml-1 h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className={transaction.is_recommended ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}>
                  <TableCell className="font-medium">
                    {formatTransactionDate(transaction.transaction_date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.is_recommended && (
                        <IconStar className="h-4 w-4 text-yellow-500" />
                      )}
                      <span>{transaction.merchant_name}</span>
                    </div>
                    {transaction.description && transaction.description !== transaction.merchant_name && (
                      <div className="text-xs text-muted-foreground truncate max-w-[140px] sm:max-w-none">
                        {transaction.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {transaction.category ? (
                      <div className="flex items-center gap-2">
                        <CategoryIcon 
                          iconName={transaction.category_icon || 'help-circle'} 
                          color={transaction.category_color || 'gray'} 
                          size={16}
                        />
                        <span>{transaction.category.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Não categorizado</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>{transaction.points_earned}</span>
                      {transaction.is_recommended && (
                        <Badge variant="outline" className="ml-1 text-xs py-0 h-5 border-yellow-500 text-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10">
                          +{Math.round(transaction.points_earned * 0.5)}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}