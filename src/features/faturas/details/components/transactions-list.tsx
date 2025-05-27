// src/features/faturas/details/components/transactions-list.tsx
import { useState, useEffect, useCallback } from 'react'
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
import { Pagination } from '@/components/pagination'

interface TransactionsListProps {
  transactions: {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  onPaginationChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (field: 'date' | 'amount' | 'merchant', order: 'asc' | 'desc') => void;
  onCategoryFilterChange: (category: string) => void;
  sortField: 'date' | 'amount' | 'merchant';
  sortOrder: 'asc' | 'desc';
  categoryFilter: string;
  categories: { id: string; name: string }[];
}

export function TransactionsList({ 
  transactions, 
  onPaginationChange,
  onSearchChange,
  onSortChange,
  onCategoryFilterChange,
  sortField,
  sortOrder,
  categoryFilter,
  categories
}: TransactionsListProps) {
  // Use o valor atual do search como estado inicial
  const [searchQuery, setSearchQuery] = useState('')
  
  // Quando os parâmetros externos mudam, atualize o estado local do searchQuery
  useEffect(() => {
    // Este efeito sincroniza o campo de pesquisa com o valor externo
    if (transactions) {
      // Podemos obter o valor do search a partir dos filtros ou da URL
      // Este valor vem dos parâmetros props que vêm do componente pai
      const currentSearchFromParams = new URLSearchParams(window.location.search).get('search') || '';
      
      // Só atualiza se for diferente para evitar loops
      if (currentSearchFromParams !== searchQuery) {
        console.log('Sincronizando campo de busca com valor da URL:', currentSearchFromParams);
        setSearchQuery(currentSearchFromParams);
      }
    }
  }, [transactions, searchQuery]);
  
  // Aplicar debounce à pesquisa
  useEffect(() => {
    const timer = setTimeout(() => {
      // Não dispare a pesquisa apenas se o componente acabou de ser carregado e a busca estiver vazia
      if (searchQuery !== '') {
        console.log('Aplicando busca:', searchQuery);
        onSearchChange(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearchChange]);

  // Função para alternar a ordenação
  const toggleSort = useCallback((field: 'date' | 'amount' | 'merchant') => {
    console.log('Alterando ordenação:', field, sortField === field ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc');
    if (sortField === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
  }, [sortField, sortOrder, onSortChange]);

  // Função para formatar data
  const formatTransactionDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM', { locale: pt })
    } catch (e) {
      console.log(e);
      return dateString
    }
  }, []);

  // Função para lidar com a mudança de página
  const handlePageChange = useCallback((page: number) => {
    console.log('TransactionsList - Mudando para página:', page);
    onPaginationChange(page);
  }, [onPaginationChange]);

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
        
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <IconFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="uncategorized">Sem categoria</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {!transactions.data || transactions.data.length === 0 ? (
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
              {transactions.data.map((transaction) => (
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
          
          {transactions.last_page > 1 && (
            <div className="flex justify-center py-4">
              <Pagination
                currentPage={transactions.current_page}
                totalPages={transactions.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}