import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { BadgeInfo } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PointsStatusProps {
  data?: any[]
  isLoading?: boolean
}

export function PointsStatus({ data, isLoading = false }: PointsStatusProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false)
        setChartData(data || [])
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setChartData(data || [])
    }
  }, [isLoading, data])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] w-full">
        <Skeleton className="h-48 w-48 rounded-full" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Alert variant="default" className="bg-muted flex items-center justify-center h-[300px]">
        <BadgeInfo className="h-4 w-4 mr-2" />
        <AlertDescription>
          Você ainda não tem pontos acumulados. Configure seus cartões e adicione faturas para começar a acumular.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} pontos`, 'Total']}
            contentStyle={{ 
              background: 'var(--background)', 
              border: '1px solid var(--border)' 
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}