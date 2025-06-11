import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, Activity, Wifi } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface SystemService {
  name: string
  status: 'online' | 'warning' | 'offline'
  uptime: number
  responseTime: number
}

interface SystemHealthProps {
  data?: {
    services: SystemService[]
    overallHealth: number
    lastUpdate: string
  }
  isLoading?: boolean
}

export function SystemHealthCard({ data, isLoading = false }: SystemHealthProps) {
  const mockData = {
    services: [
      { name: 'API Principal', status: 'online' as const, uptime: 99.9, responseTime: 120 },
      { name: 'Processamento IA', status: 'online' as const, uptime: 98.5, responseTime: 250 },
      { name: 'Base de Dados', status: 'warning' as const, uptime: 97.2, responseTime: 180 },
      { name: 'Sistema de Arquivos', status: 'online' as const, uptime: 99.7, responseTime: 80 },
      { name: 'Cache Redis', status: 'online' as const, uptime: 99.8, responseTime: 45 }
    ],
    overallHealth: 98.8,
    lastUpdate: new Date().toISOString()
  }

  const displayData = data || mockData

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'offline': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'online': return 'default'
      case 'warning': return 'secondary'
      case 'offline': return 'destructive'
      default: return 'outline'
    }
  }

  const getOverallHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600'
    if (health >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-medium">Saúde Geral</span>
        </div>
        <div className={`text-2xl font-bold ${getOverallHealthColor(displayData.overallHealth)}`}>
          {displayData.overallHealth}%
        </div>
      </div>

      <div className="space-y-3">
        {displayData.services.map((service, index) => (
          <div key={index} className="space-y-2 p-3 border rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span className="text-sm font-medium">{service.name}</span>
              </div>
              <Badge variant={getStatusVariant(service.status)} className="text-xs">
                {service.status === 'online' ? 'Online' : 
                 service.status === 'warning' ? 'Atenção' : 'Offline'}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uptime: {service.uptime}%</span>
                <span>Resposta: {service.responseTime}ms</span>
              </div>
              <Progress 
                value={service.uptime} 
                className="h-2"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-2 border-t">
        <Wifi className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          Atualizado em {new Date(displayData.lastUpdate).toLocaleTimeString('pt-BR')}
        </span>
      </div>
    </div>
  )
}
