import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Transaction } from '@/services/dashboard-service'

interface RecentTransactionsProps {
  data?: Transaction[]
  isLoading?: boolean
}

const defaultTransactions = [
  {
    id: '1',
    merchant: 'Supermercado Extra',
    merchantLogo: '/placeholder.svg',
    category: 'Alimentação',
    amount: 'R$ 243,56',
    points: 97,
    isRecommended: true
  },
  {
    id: '2',
    merchant: 'Netflix',
    merchantLogo: '/placeholder.svg',
    category: 'Streaming',
    amount: 'R$ 55,90',
    points: 28,
    isRecommended: false
  },
  {
    id: '3',
    merchant: 'Posto Shell',
    merchantLogo: '/placeholder.svg',
    category: 'Combustível',
    amount: 'R$ 210,45',
    points: 110,
    isRecommended: true
  },
  {
    id: '4',
    merchant: 'Restaurante Outback',
    merchantLogo: '/placeholder.svg',
    category: 'Restaurantes',
    amount: 'R$ 180,76',
    points: 90,
    isRecommended: false
  },
  {
    id: '5',
    merchant: 'Amazon',
    merchantLogo: '/placeholder.svg',
    category: 'Compras Online',
    amount: 'R$ 143,20',
    points: 72,
    isRecommended: true
  },
]

export function RecentTransactions({ data, isLoading = false }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    // Simula uma chamada de API
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false)
        setTransactions(data || defaultTransactions)
      }, 1800)
      return () => clearTimeout(timer)
    } else {
      setTransactions(data || defaultTransactions)
    }
  }, [isLoading, data])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-4 w-[60px] ml-auto" />
              <Skeleton className="h-3 w-[40px] ml-auto" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Alert variant="default" className="bg-muted">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhuma transação encontrada. Adicione uma fatura para começar a analisar seus gastos.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='space-y-8'>
      {transactions.map((transaction) => (
        <div key={transaction.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            {transaction.merchantLogo ? (
              <AvatarImage src={transaction.merchantLogo} alt={transaction.merchant} />
            ) : (
              <AvatarFallback>{transaction.merchant.substring(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>{transaction.merchant}</p>
              <p className='text-xs text-muted-foreground'>{transaction.category}</p>
            </div>
            <div className='space-y-1 text-right'>
              <p className={cn('text-sm font-medium', transaction.isRecommended && 'text-orange-500')}>
                {transaction.amount}
              </p>
              <p className='text-xs text-muted-foreground'>{transaction.points} pts</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

