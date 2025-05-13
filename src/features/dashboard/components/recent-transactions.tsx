import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function RecentTransactions() {
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

const transactions = [
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