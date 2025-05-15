
import { useState, useEffect } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface OverviewProps {
  data?: typeof defaultData
  isLoading?: boolean
}

const defaultData = [
  {
    name: 'Jan',
    total: 1890,
  },
  {
    name: 'Fev',
    total: 2350,
  },
  {
    name: 'Mar',
    total: 3100,
  },
  {
    name: 'Abr',
    total: 2700,
  },
  {
    name: 'Mai',
    total: 3250,
  },
  {
    name: 'Jun',
    total: 3521,
  },
]

export function Overview({ data = defaultData, isLoading = false }: OverviewProps) {
  const [chartData, setChartData] = useState(data)
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    // Simula uma chamada de API
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  useEffect(() => {
    setChartData(data)
  }, [data])

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Tooltip 
          formatter={(value) => [`R$ ${value}`, 'Total']}
          contentStyle={{ 
            background: 'var(--background)', 
            border: '1px solid var(--border)' 
          }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}