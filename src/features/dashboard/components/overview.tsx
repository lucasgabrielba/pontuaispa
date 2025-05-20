import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface OverviewProps {
  data?: any[]
  isLoading?: boolean
}

export function Overview({ data, isLoading = false }: OverviewProps) {
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
    setChartData(data || [])
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

  if (!chartData || chartData.length === 0) {
    return (
      <Alert variant="default" className="bg-muted flex items-center justify-center h-[350px]">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Nenhum dado disponível. Adicione faturas para visualizar seus gastos mensais.
        </AlertDescription>
      </Alert>
    )
  }

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground">Mês</span>
                      <span className="font-bold text-foreground">{label}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground">Total</span>
                      <span className="font-bold text-primary">{formatCurrency(Number(payload[0].value) || 0)}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
          cursor={{ fill: "var(--primary-foreground)", opacity: 0.1 }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
