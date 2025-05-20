import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Transaction } from '@/services/dashboard-service'
import { CategoryIcon } from '@/components/category-icon'

interface RecentTransactionsProps {
  data?: Transaction[]
  isLoading?: boolean
}

export function RecentTransactions({ data, isLoading = false }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false)
        setTransactions(data || [])
      }, 1800)
      return () => clearTimeout(timer)
    } else {
      setTransactions(data || [])
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
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Nenhuma transação encontrada. Adicione uma fatura para começar a analisar seus gastos.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='space-y-8'>
      {transactions.map((transaction) => {
        return (
          <div key={transaction.id} className='flex items-center gap-4'>
            <CategoryIcon 
              iconName={transaction.category_icon}
              color={transaction.category_color}
              // fallback={transaction.merchant.substring(0, 2).toUpperCase()}
              className="h-9 w-9"
            />
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>{transaction.merchant.substring(0, 50)}</p>
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
        )
      })}
    </div>
  )
}