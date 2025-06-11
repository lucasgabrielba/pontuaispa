import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AdminOverviewProps {
  data?: any[]
  isLoading?: boolean
}

export function AdminOverview({ data, isLoading = false }: AdminOverviewProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  useEffect(() => {
    setChartData(data || [
      { name: "01/01", processed: 45, pending: 12, errors: 2 },
      { name: "02/01", processed: 52, pending: 8, errors: 1 },
      { name: "03/01", processed: 48, pending: 15, errors: 3 },
      { name: "04/01", processed: 61, pending: 6, errors: 0 },
      { name: "05/01", processed: 55, pending: 11, errors: 2 },
      { name: "06/01", processed: 67, pending: 9, errors: 1 },
      { name: "07/01", processed: 59, pending: 13, errors: 4 }
    ])
  }, [data])

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Alert variant="default" className="bg-muted flex items-center justify-center h-[350px]">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Nenhum dado de processamento disponível no momento.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-3 shadow-sm">
                  <div className="grid gap-2">
                    <div className="font-medium">{label}</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-green-600">Processadas</span>
                        <span className="font-bold">{payload[0]?.value || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-yellow-600">Pendentes</span>
                        <span className="font-bold">{payload[1]?.value || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-red-600">Erros</span>
                        <span className="font-bold">{payload[2]?.value || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Bar 
          dataKey="processed" 
          name="Processadas"
          fill="hsl(142, 76%, 36%)" 
          radius={[2, 2, 0, 0]} 
        />
        <Bar 
          dataKey="pending" 
          name="Pendentes"
          fill="hsl(48, 96%, 53%)" 
          radius={[2, 2, 0, 0]} 
        />
        <Bar 
          dataKey="errors" 
          name="Erros"
          fill="hsl(0, 84%, 60%)" 
          radius={[2, 2, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}